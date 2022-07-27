import Exiting from 'exiting'
import { app } from './app.js'
import type { Config } from './interfaces.js'

/**
 * Provision and configure a Hapi.Server for the specified environment.
 */
export const provision = async (env: NodeJS.ProcessEnv) => {
  const app_human_readable_name = 'Demo App'
  const app_technical_name = 'my-cloud-run-service-id'
  const app_version = 'latest'

  if (!env.NODE_ENV) {
    throw new Error(`environment variable NODE_ENV not set`)
  }
  const environment = env.NODE_ENV

  const port = env.PORT || 8080

  if (!env.TELEGRAM) {
    throw new Error(`environment variable TELEGRAM not set`)
  }
  const telegram_json = env.TELEGRAM
  const { chat_id: telegram_chat_id, token: telegram_token } =
    JSON.parse(telegram_json)

  const config: Config = {
    app_human_readable_name,
    app_technical_name,
    app_version,
    environment,
    port,
    telegram_chat_id,
    telegram_token
  }

  const { server } = await app(config)

  // https://github.com/kanongil/exiting
  const manager = Exiting.createManager([server], { exitTimeout: 10000 })

  server.log(['lifecycle'], {
    message: 'manager created to handle safe shutdown of server/s'
  })

  await manager.start()

  server.log(['lifecycle'], {
    message: `server started on port ${port} [${environment}]`
  })

  return { app_human_readable_name, environment, port, server }
}
