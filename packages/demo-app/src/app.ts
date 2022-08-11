import Hapi from '@hapi/hapi'
import hapi_dev_errors from 'hapi-dev-errors'
import logger from '@jackdbd/hapi-logger-plugin'
import {
  isServerRequestError,
  isTeapotRequestError
} from '@jackdbd/hapi-request-event-predicates'
import telegram, { serverError, teapot } from '@jackdbd/hapi-telegram-plugin'
import type { RequestEventMatcher } from '@jackdbd/hapi-telegram-plugin/interfaces'
import { brokenGet } from './routes/broken.js'
import { helloGet } from './routes/hello.js'

interface Config {
  environment: string
  port: number | string
  telegram_chat_id: number | string
  telegram_token: string
}

export const app = async (config: Config) => {
  const { environment, port, telegram_chat_id, telegram_token } = config

  const app_human_readable_name = 'Demo app'

  const server = Hapi.server({
    // disable Hapi debug console logging, since I don't particulary like it (I
    // prefer writing my own loggers for development/production)
    debug: false,
    port
  })
  server.log(['debug', 'lifecycle'], { message: `HTTP server created.` })

  // PLUGINS begin /////////////////////////////////////////////////////////////
  await server.register({
    plugin: hapi_dev_errors,
    options: {
      showErrors: environment !== 'production'
    }
  })

  server.register({
    plugin: logger,
    options: { namespace: 'demo-app' }
  })
  server.log(['debug', 'plugin'], {
    message: `plugin ${logger.name} registered`
  })

  const request_event_matchers: RequestEventMatcher[] = [
    {
      name: 'notify of any server error',
      text: serverError,
      predicate: isServerRequestError,
      chat_id: telegram_chat_id,
      token: telegram_token
    },
    {
      name: `notify of HTTP 418 I'm a Teapot (client error)`,
      text: teapot,
      predicate: isTeapotRequestError,
      chat_id: telegram_chat_id,
      token: telegram_token
    }
  ]

  server.register({ plugin: telegram, options: { request_event_matchers } })
  server.log(['debug', 'plugin'], {
    message: `plugin ${telegram.name} registered`
  })
  // PLUGINS end ///////////////////////////////////////////////////////////////

  // ROUTES begin //////////////////////////////////////////////////////////////
  server.route(brokenGet({ app_human_readable_name }))
  server.log(['debug', 'route'], { message: `route /broken GET registered` })

  server.route(helloGet({ app_human_readable_name }))
  server.log(['debug', 'route'], { message: `route /hello GET registered` })
  // ROUTES end ////////////////////////////////////////////////////////////////

  return { server }
}
