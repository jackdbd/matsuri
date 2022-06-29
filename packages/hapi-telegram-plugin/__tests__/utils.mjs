import Hapi from '@hapi/hapi'
import plugin from '../lib/index.js'

export const testServer = async () => {
  const server = Hapi.server({ port: 8080 })

  const json = process.env.TELEGRAM
  const { chat_id, token } = JSON.parse(json)

  await server.register({
    plugin,
    options: {
      chat_id,
      token
    }
  })

  return server
}
