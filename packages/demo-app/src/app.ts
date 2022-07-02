import Hapi from '@hapi/hapi'
import hapi_dev_errors from 'hapi-dev-errors'
import telegramPlugin from '@jackdbd/hapi-telegram-plugin'
import type { Config } from './interfaces.js'
import { brokenGet } from './routes/broken.js'
import { helloGet } from './routes/hello.js'

export const app = async (config: Config) => {
  const {
    app_human_readable_name,
    app_technical_name,
    app_version,
    environment,
    port,
    telegram_chat_id,
    telegram_token
  } = config

  const server = Hapi.server({
    // disable Hapi debug console logging, since I don't particulary like it (I
    // prefer writing my own loggers for development/production)
    debug: false,
    port
  })

  await server.register({
    plugin: hapi_dev_errors,
    options: {
      showErrors: environment !== 'production'
    }
  })

  server.log(['lifecycle'], { message: `HTTP server created.` })

  server.register({
    plugin: telegramPlugin,
    options: {
      app_human_readable_name,
      app_technical_name,
      app_version,
      chat_id: telegram_chat_id,
      token: telegram_token
    }
  })

  server.log(['lifecycle'], { message: `Telegram plugin registered.` })

  server.route(brokenGet({ app_human_readable_name }))

  server.route(helloGet({ app_human_readable_name }))

  server.log(['lifecycle'], { message: `all routes registered.` })

  return { server }
}
