import fs from 'node:fs'
import path from 'node:path'
import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'
import plugin from '../lib/index.js'

const package_json_path = path.join('package.json')
const pkg = JSON.parse(fs.readFileSync(package_json_path))

export const testServer = async () => {
  const server = Hapi.server({ port: 8080 })

  server.route({
    method: 'GET',
    path: '/success',
    handler: (request, h) => {
      return { message: 'all good' }
    }
  })

  server.route({
    method: 'GET',
    path: '/internal-error',
    handler: (request, h) => {
      throw new Error(
        'this is not the message you will see in the HTTP response'
      )
    }
  })

  server.route({
    method: 'GET',
    path: '/private',
    handler: (request, h) => {
      throw Boom.unauthorized()
    }
  })

  server.route({
    method: 'GET',
    path: '/teapot',
    handler: (request, h) => {
      throw Boom.teapot()
    }
  })

  const json = process.env.TELEGRAM
  const { chat_id, token } = JSON.parse(json)

  await server.register({
    plugin,
    options: {
      app_human_readable_name: 'Hapi-Telegram-Plugin test app',
      app_technical_name: pkg.name,
      app_version: pkg.version,
      chat_id,
      token
    }
  })

  return server
}
