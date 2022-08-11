import fs from 'node:fs'
import path from 'node:path'
import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'

export const requestId = () => `request-id-${Math.floor(Math.random() * 1000)}`

export const timestampMs = () => new Date().getTime()

export const testServer = async () => {
  const server = Hapi.server({
    // debug: { log: ['*'], request: ['*'] },
    port: 8080
  })

  server.route({
    method: 'GET',
    path: '/success',
    handler: (request, h) => {
      return { message: 'all good' }
    }
  })

  server.route({
    method: 'GET',
    path: '/internal',
    handler: (request, h) => {
      throw Boom.internal()
    }
  })

  server.route({
    method: 'GET',
    path: '/not-implemented',
    handler: (request, h) => {
      throw Boom.notImplemented()
    }
  })

  server.route({
    method: 'GET',
    path: '/unauthorized',
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

  return server
}

export const telegramCredentials = () => {
  let json
  if (process.env.TELEGRAM) {
    json = process.env.TELEGRAM
  } else {
    const filepath = path.resolve('..', '..', 'secrets', 'telegram.json')
    json = fs.readFileSync(filepath, { encoding: 'utf8' })
  }

  let chat_id
  let token
  if (json) {
    const creds = JSON.parse(json)
    chat_id = creds.chat_id
    token = creds.token
  }

  if (process.env.TELEGRAM_BOT_TOKEN) {
    token = process.env.TELEGRAM_BOT_TOKEN
  }

  if (process.env.TELEGRAM_CHAT_ID) {
    chat_id = process.env.TELEGRAM_CHAT_ID
  }

  if (!chat_id) {
    throw new Error(`no Telegram chat ID is set`)
  }
  if (!token) {
    throw new Error(`no Telegram bot token is set`)
  }

  return { chat_id, token }
}
