import path from 'node:path';
import Hapi from '@hapi/hapi';
import Bell from '@hapi/bell';
import Blipp from 'blipp';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import hapi_dev_errors from 'hapi-dev-errors';
import githubIssue from '@jackdbd/hapi-github-issue-plugin';
import { defaultTitleFunction, defaultBodyFunction } from '@jackdbd/hapi-github-issue-plugin/texts';
import logger from '@jackdbd/hapi-logger-plugin';
import { isServerRequestError, isTeapotRequestError, isUnauthorizedRequestError } from '@jackdbd/hapi-request-event-predicates';
import telegram from '@jackdbd/hapi-telegram-plugin';
import AuthCookie from '@hapi/cookie';
import { serverError, teapot, unauthorized } from '@jackdbd/hapi-telegram-plugin/texts';
import Nunjucks from 'nunjucks';
import { authGitHub, authGoogle, errorGet, homeGet, logout, protectedGet } from './routes/index.js';
import { environment as environment_schema, telegram_credentials as telegram_credentials_schema } from './schemas.js';
export const app = async () => {
    const { error, value: environment } = environment_schema.validate(process.env.NODE_ENV);
    if (error) {
        throw new Error(error.message);
    }
    const port = process.env.PORT || 8080;
    if (!process.env.APP_CONFIG) {
        throw new Error(`environment variable APP_CONFIG not set`);
    }
    const { bell_cookie_password, session_cookie_password } = JSON.parse(process.env.APP_CONFIG);
    const { error: error_telegram, value: telegram_credentials } = telegram_credentials_schema.validate(JSON.parse(process.env.TELEGRAM), {
        allowUnknown: true
    });
    if (error_telegram) {
        throw new Error(error_telegram.message);
    }
    const { chat_id: telegram_chat_id, token: telegram_token } = telegram_credentials;
    const server = Hapi.server({
        debug: false,
        port
    });
    await server.register({
        plugin: hapi_dev_errors,
        options: {
            showErrors: environment !== 'production'
        }
    });
    await server.register(Inert);
    await server.register(Bell);
    await server.register(Vision);
    server.views({
        engines: {
            njk: {
                compile: (src, options) => {
                    const template = Nunjucks.compile(src, options.environment);
                    return (context) => {
                        return template.render(context);
                    };
                },
                prepare: (options, next) => {
                    options.compileOptions.environment = Nunjucks.configure(options.path, { watch: false });
                    return next();
                }
            }
        },
        path: path.resolve('templates')
    });
    await server.register({ plugin: AuthCookie });
    if (process.env.NODE_END === 'development') {
        await server.register({
            plugin: Blipp,
            options: { showAuth: true, showScope: true, showStart: true }
        });
    }
    const namespace = process.env.NODE_ENV === 'development' ? 'demo-app' : undefined;
    const should_validate_log_statements = process.env.NODE_ENV === 'production' ? false : true;
    server.register({
        plugin: logger,
        options: { namespace, should_validate_log_statements }
    });
    server.log(['debug', 'plugin'], {
        message: `plugin ${logger.name} registered`
    });
    await server.register({
        plugin: githubIssue,
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
    });
    server.log(['debug', 'plugin'], {
        message: `plugin ${githubIssue.name} registered`
    });
    const request_event_matchers = [
        {
            name: 'notify of any server error',
            text: serverError,
            predicate: isServerRequestError,
            chat_id: telegram_chat_id,
            token: telegram_token
        },
        {
            name: 'notify of any HTTP 401 Unauthorized (client error)',
            text: unauthorized,
            predicate: isUnauthorizedRequestError,
            chat_id: telegram_chat_id,
            token: telegram_token
        },
        {
            name: `notify of any HTTP 418 I'm a Teapot (client error)`,
            text: teapot,
            predicate: isTeapotRequestError,
            chat_id: telegram_chat_id,
            token: telegram_token
        }
    ];
    server.register({ plugin: telegram, options: { request_event_matchers } });
    server.log(['debug', 'plugin'], {
        message: `plugin ${telegram.name} registered`
    });
    if (!process.env.GITHUB_OAUTH_APP) {
        throw new Error(`environment variable GITHUB_OAUTH_APP not set`);
    }
    const github_oauth_app = JSON.parse(process.env.GITHUB_OAUTH_APP);
    server.log(['info', 'oauth', 'github'], {
        message: `GitHub OAuth App: ${JSON.stringify(github_oauth_app)}`
    });
    const isSecure = false;
    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: 'sid',
            password: session_cookie_password,
            isHttpOnly: true,
            isSameSite: 'Strict',
            isSecure,
            path: '/'
        },
        redirectTo: '/auth/github'
    });
    server.auth.strategy('github', 'bell', {
        provider: 'github',
        password: bell_cookie_password,
        isSecure,
        clientId: github_oauth_app.client_id,
        clientSecret: github_oauth_app.client_secret
    });
    if (!process.env.GOOGLE_OAUTH_APP) {
        throw new Error(`environment variable GOOGLE_OAUTH_APP not set`);
    }
    const google_oauth_app = JSON.parse(process.env.GOOGLE_OAUTH_APP);
    server.log(['info', 'oauth', 'google'], {
        message: `Google OAuth App: ${JSON.stringify(google_oauth_app)}`
    });
    server.auth.strategy('google', 'bell', {
        provider: 'google',
        password: bell_cookie_password,
        isSecure,
        clientId: google_oauth_app.client_id,
        clientSecret: google_oauth_app.client_secret,
        location: process.env.NODE_ENV === 'development'
            ? 'http://localhost:8080'
            : 'https://matsuri-demo-app-45eyyotfta-ey.a.run.app'
    });
    server.route(homeGet());
    server.route(errorGet());
    server.route(authGitHub());
    server.route(authGoogle());
    server.route(logout());
    server.route(protectedGet());
    return { server };
};
