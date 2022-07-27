import Hapi from '@hapi/hapi'
// import hapi_dev_errors from 'hapi-dev-errors'
import logger from '@jackdbd/hapi-logger-plugin'
import telegram from '@jackdbd/hapi-telegram-plugin'
import type { Config } from './interfaces.js'
import { brokenGet } from './routes/broken.js'
import { helloGet } from './routes/hello.js'

export const app = async (config: Config) => {
  const {
    app_human_readable_name,
    app_technical_name,
    app_version,
    // environment,
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
  server.log(['lifecycle'], { message: `HTTP server created.` })

  server.register({
    plugin: logger,
    options: {
      namespace: 'app'
    }
  })
  server.log(['plugin'], { message: `plugin ${logger.name} registered` })

  // await server.register({
  //   plugin: hapi_dev_errors,
  //   options: {
  //     showErrors: environment !== 'production'
  //   }
  // })

  server.register({
    plugin: telegram,
    options: {
      app_human_readable_name,
      app_technical_name,
      app_version,
      chat_id: telegram_chat_id,
      token: telegram_token
    }
  })
  server.log(['plugin'], { message: `plugin ${telegram.name} registered` })

  server.route(brokenGet({ app_human_readable_name }))
  server.log(['route'], { message: `route /broken GET registered` })

  server.route(helloGet({ app_human_readable_name }))
  server.log(['route'], { message: `route /hello GET registered` })

  return { server }
}
