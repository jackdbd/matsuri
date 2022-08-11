import Exiting from 'exiting'
import { app } from './app.js'

/**
 * Provision and configure a Hapi.Server for the specified environment.
 */
export const provision = async () => {
  if (!process.env.NODE_ENV) {
    throw new Error(`environment variable NODE_ENV not set`)
  }
  const environment = process.env.NODE_ENV

  const port = process.env.PORT || 8080

  if (!process.env.TELEGRAM) {
    throw new Error(`environment variable TELEGRAM not set`)
  }
  const telegram_json = process.env.TELEGRAM
  const { chat_id: telegram_chat_id, token: telegram_token } =
    JSON.parse(telegram_json)

  const config = {
    environment,
    port,
    telegram_chat_id,
    telegram_token
  }

  const { server } = await app(config)

  // https://github.com/kanongil/exiting
  const manager = Exiting.createManager([server], { exitTimeout: 10000 })

  server.log(['debug', 'lifecycle'], {
    message: 'manager created to handle safe shutdown of server/s'
  })

  await manager.start()

  server.log(['debug', 'lifecycle'], {
    message: `server started on port ${port} [${environment}]`
  })

  return { port, server }
}
