import fs from 'node:fs'
import path from 'node:path'
import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'

export const requestId = () => `request-id-${Math.floor(Math.random() * 1000)}`

export const timestampMs = () => new Date().getTime()

export const throwIfInvokedFromMonorepoRoot = (pwd) => {
  const { name } = require(`${pwd}/package.json`)
  if (name === 'root') {
    throw new Error(
      chalk.red(
        `you invoked this script from ${pwd}. This script should be invoked from a package root instead.`
      )
    )
  }
}

export const throwIfNotInvokedFromMonorepoRoot = (pwd) => {
  const { name } = require(`${pwd}/package.json`)
  if (name !== 'root') {
    throw new Error(
      chalk.red(
        `you invoked this script from ${pwd}. This script should be invoked from the monorepo root instead.`
      )
    )
  }
}

export const unscopedPackageName = async (pwd) => {
  const { name } = require(`${pwd}/package.json`)
  const { stdout: unscoped_name } =
    await $`echo ${name} | sed 's/@jackdbd\\///' | tr -d '\n'`
  return unscoped_name
}

export const makeHapiServer = () => {
  const server = Hapi.server({
    // debug: { log: ['*'], request: ['*'] },
    debug: false,
    port: 8080
  })

  server.route({
    method: 'GET',
    path: '/success',
    handler: (request, _h) => {
      // console.log(`=== GET /success ===`)
      request.log(['debug', 'success'], { message: 'GET /success' })
      // HTTP 200
      return { message: 'all good' }
    }
  })

  server.route({
    method: 'GET',
    path: '/unauthorized',
    handler: (request, h) => {
      // console.log(`=== GET /unauthorized ===`)
      request.log(['error', 'unauthorized'], { message: 'GET /unauthorized' })
      // HTTP 403
      throw Boom.unauthorized()
    }
  })

  server.route({
    method: 'GET',
    path: '/not-found',
    handler: (request, h) => {
      request.log(['error', 'not-found'], { message: 'GET /not-found' })
      if (request.query && request.query.foo === '123') {
        return { message: 'got foo' }
      }
      // HTTP 404
      throw Boom.notFound()
    }
  })

  server.route({
    method: 'GET',
    path: '/teapot',
    handler: (request, _h) => {
      request.log(['error', 'teapot'], { message: 'GET /teapot' })
      // HTTP 418
      throw Boom.teapot()
    }
  })

  server.route({
    method: 'GET',
    path: '/internal',
    handler: (request, _h) => {
      // console.log(`=== GET /internal ===`)
      request.log(['error', 'internal'], { message: 'GET /internal' })
      // HTTP 500
      throw Boom.internal()
    }
  })

  server.route({
    method: 'GET',
    path: '/not-implemented',
    handler: (request, h) => {
      request.log(['error', 'not-implemented'], {
        message: 'GET /not-implemented'
      })
      // HTTP 501
      throw Boom.notImplemented()
    }
  })

  // https://github.com/hapijs/podium
  // https://github.com/hapijs/podium/blob/master/lib/index.js
  // Hapi.RequestEventHandler
  // server.events.on('request', (_request, event, tag_dict) => {
  //   console.log('event', event)
  //   console.log('event.tags', event.tags)
  //   console.log('tag_dict', tag_dict)
  // })

  return server
}

export const makeDispatch = ({ event, tags, predicate }) => {
  return function dispatch(req, res) {
    const b = predicate(req, event, tags)

    const reply = b ? 'PASSED' : 'FAILED'
    const status_code = b ? 200 : 400

    res.writeHead(status_code, {
      'Content-Type': 'text/plain',
      'Content-Length': reply.length
    })

    res.end(reply)
  }
}

export const telegramCredentials = () => {
  let json
  if (process.env.TELEGRAM) {
    json = process.env.TELEGRAM
  } else {
    // assuming this is called from /<monorepo-root>/packages/<package-root>/__tests__/some-test.test.mjs
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

/**
 * see Hapi.RequestEvent
 */
export const requestEventWithData = ({
  tags = ['test'],
  channel = 'app',
  data = undefined
}) => {
  return {
    timestamp: new Date().getTime(), // ms
    tags,
    channel,
    // data cannot appear together with error
    data
  }
}

/**
 * see Hapi.RequestEvent
 */
export const requestEventWithError = ({
  tags = ['test'],
  channel = 'app',
  error = new Error('an error occurred')
}) => {
  return {
    timestamp: new Date().getTime(), // ms
    tags,
    channel,
    // the error object related to the event if applicable. Cannot appear together with data.
    error
  }
}
