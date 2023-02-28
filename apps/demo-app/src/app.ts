import path from 'node:path'
import Hapi from '@hapi/hapi'
import Bell from '@hapi/bell'
import Blipp from 'blipp'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import hapi_dev_errors from 'hapi-dev-errors'
import githubIssue from '@jackdbd/hapi-github-issue-plugin'
import {
  defaultTitleFunction,
  defaultBodyFunction
} from '@jackdbd/hapi-github-issue-plugin/texts'
import logger from '@jackdbd/hapi-logger-plugin'
import {
  isServerRequestError,
  isTeapotRequestError,
  isUnauthorizedRequestError
} from '@jackdbd/hapi-request-event-predicates'
import telegram from '@jackdbd/hapi-telegram-plugin'
import AuthCookie from '@hapi/cookie'
import {
  serverError,
  teapot,
  unauthorized
} from '@jackdbd/hapi-telegram-plugin/texts'
import type { RequestEventMatcher } from '@jackdbd/hapi-telegram-plugin/interfaces'
import Nunjucks from 'nunjucks'
import {
  authGitHub,
  authGoogle,
  errorGet,
  homeGet,
  logout,
  protectedGet
} from './routes/index.js'
import {
  environment as environment_schema,
  telegram_credentials as telegram_credentials_schema
} from './schemas.js'
import type { AppConfig, OAuthApp, TelegramCredentials } from './interfaces.js'

export const app = async () => {
  const { error, value: environment } = environment_schema.validate(
    process.env.NODE_ENV
  )
  if (error) {
    throw new Error(error.message)
  }

  const port = process.env.PORT || 8080

  if (!process.env.APP_CONFIG) {
    throw new Error(`environment variable APP_CONFIG not set`)
  }
  const { bell_cookie_password, session_cookie_password } = JSON.parse(
    process.env.APP_CONFIG
  ) as AppConfig

  const { error: error_telegram, value: telegram_credentials } =
    telegram_credentials_schema.validate(JSON.parse(process.env.TELEGRAM), {
      allowUnknown: true
    })
  if (error_telegram) {
    throw new Error(error_telegram.message)
  }

  const { chat_id: telegram_chat_id, token: telegram_token } =
    telegram_credentials as TelegramCredentials

  const server: any = Hapi.server({
    // disable Hapi debug console logging, since I don't particulary like it and
    // I prefer writing my own loggers for development/production.
    debug: false,
    port
  })

  // PLUGINS begin /////////////////////////////////////////////////////////////
  await server.register({
    plugin: hapi_dev_errors,
    options: {
      showErrors: environment !== 'production'
    }
  })

  await server.register(Inert as any)

  await server.register(Bell as any)

  await server.register(Vision as any)

  server.views({
    engines: {
      njk: {
        compile: (src: string, options: any) => {
          const template = Nunjucks.compile(src, options.environment)

          return (context: any) => {
            return template.render(context)
          }
        },
        prepare: (options: any, next: any) => {
          options.compileOptions.environment = Nunjucks.configure(
            options.path,
            { watch: false } // watch requires chokidar to be installed
          )

          return next()
        }
      }
    },
    path: path.resolve('templates')
  })

  // the @hapi/cookie plugin defines a 'cookie' scheme
  await server.register({ plugin: AuthCookie as any })

  if (process.env.NODE_END === 'development') {
    await server.register({
      plugin: Blipp,
      options: { showAuth: true, showScope: true, showStart: true }
    })
  }

  const namespace =
    process.env.NODE_ENV === 'development' ? 'demo-app' : undefined

  const should_validate_log_statements =
    process.env.NODE_ENV === 'production' ? false : true

  server.register({
    plugin: logger,
    options: { namespace, should_validate_log_statements }
  })
  server.log(['debug', 'plugin'], {
    message: `plugin ${logger.name} registered`
  })

  await server.register({
    plugin: githubIssue as any,
    options: {
      request_event_matchers: [
        {
          predicate: isServerRequestError,
          title: defaultTitleFunction,
          body: defaultBodyFunction,
          assignees: ['jackdbd'],
          labels: ['bug', 'matsuri-test']
        },
        {
          predicate: isTeapotRequestError,
          title: defaultTitleFunction,
          body: defaultBodyFunction,
          assignees: ['jackdbd'],
          labels: ['teapot', 'matsuri-test']
        }
      ]
    }
  })
  server.log(['debug', 'plugin'], {
    message: `plugin ${githubIssue.name} registered`
  })

  const request_event_matchers: RequestEventMatcher[] = [
    {
      name: 'notify of any server error',
      text: serverError,
      predicate: isServerRequestError as any,
      chat_id: telegram_chat_id,
      token: telegram_token
    },
    {
      name: 'notify of any HTTP 401 Unauthorized (client error)',
      text: unauthorized,
      predicate: isUnauthorizedRequestError as any,
      chat_id: telegram_chat_id,
      token: telegram_token
    },
    {
      name: `notify of any HTTP 418 I'm a Teapot (client error)`,
      text: teapot,
      predicate: isTeapotRequestError as any,
      chat_id: telegram_chat_id,
      token: telegram_token
    }
  ]

  server.register({ plugin: telegram, options: { request_event_matchers } })
  server.log(['debug', 'plugin'], {
    message: `plugin ${telegram.name} registered`
  })
  // PLUGINS end ///////////////////////////////////////////////////////////////

  // AUTH STRATEGIES begin /////////////////////////////////////////////////////
  if (!process.env.GITHUB_OAUTH_APP) {
    throw new Error(`environment variable GITHUB_OAUTH_APP not set`)
  }

  const github_oauth_app: OAuthApp = JSON.parse(process.env.GITHUB_OAUTH_APP)

  server.log(['info', 'oauth', 'github'], {
    message: `GitHub OAuth App: ${JSON.stringify(github_oauth_app)}`
  })

  // We ALWAYS set isSecure to false because BOTH on localhost and on Cloud Run
  // we are working with HTTP, not HTTPS.
  // Remember: a Cloud Run service sits behind Google Front End (GFE), which
  // performs SSL/TLS termination (aka SSL/TLS offloading). A Cloud Run service
  // ALWAYS has a GFE in front of it, and GFE ALWAYS performs SSL/TLS
  // termination (it cannot be skipped/replaced).
  const isSecure = false

  // Define a new authentication strategy called 'session' that uses the
  // authentication scheme called 'cookie'
  // Register session based auth strategy to store credentials received from
  // GitHub and keep the user logged in.

  // https://github.com/hapijs/cookie/blob/master/API.md
  server.auth.strategy('session', 'cookie', {
    cookie: {
      // 'sid' stands for 'session id' (it's the default)
      name: 'sid',
      // the password used to encrypt the cookie should be at least 32 characters
      password: session_cookie_password,
      isHttpOnly: true,
      isSameSite: 'Strict',
      isSecure,
      path: '/'
      // By default the TTL of the session cookie is not defined. This means
      // that the session cookie is cleared when the browser closes.
    },

    redirectTo: '/auth/github'

    // validation function used to validate the content of the session cookie on
    // each request.
    // validateFunc: async (_request: any, session: Session) => {
    //   return { valid: true, credentials: session }
    // }
  })

  // https://github.com/hapijs/bell/blob/master/lib/providers/github.js
  // https://docs.github.com/en/developers/apps/managing-oauth-apps/troubleshooting-authorization-request-errors
  // https://github.com/pennersr/django-allauth/issues/1483
  // https://github.com/python-social-auth/social-app-django/issues/174
  server.auth.strategy('github', 'bell', {
    provider: 'github',
    password: bell_cookie_password,
    isSecure,
    clientId: github_oauth_app.client_id,
    clientSecret: github_oauth_app.client_secret
  })

  if (!process.env.GOOGLE_OAUTH_APP) {
    throw new Error(`environment variable GOOGLE_OAUTH_APP not set`)
  }
  const google_oauth_app: OAuthApp = JSON.parse(process.env.GOOGLE_OAUTH_APP)
  server.log(['info', 'oauth', 'google'], {
    message: `Google OAuth App: ${JSON.stringify(google_oauth_app)}`
  })

  // https://github.com/hapijs/bell/blob/master/examples/google.js
  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password: bell_cookie_password,
    isSecure,
    clientId: google_oauth_app.client_id,
    clientSecret: google_oauth_app.client_secret,
    // location: server.info.uri
    location:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : 'https://matsuri-demo-app-45eyyotfta-ey.a.run.app'
  })
  // AUTH STRATEGIES end ///////////////////////////////////////////////////////

  // ROUTES begin //////////////////////////////////////////////////////////////
  server.route(homeGet())
  server.route(errorGet())
  server.route(authGitHub())
  server.route(authGoogle())
  server.route(logout())
  server.route(protectedGet())
  // ROUTES end ////////////////////////////////////////////////////////////////

  return { server }
}
