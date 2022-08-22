import {
  isServerRequestError,
  isTeapotRequestError,
  isUnauthorizedRequestError
} from '@jackdbd/hapi-request-event-predicates'
import plugin from '../lib/index.js'
import { serverError, teapot, unauthorized } from '../lib/texts.js'
import { makeHapiServer, telegramCredentials } from '../../../scripts/utils.mjs'

// const package_json_path = path.join('package.json')
// const pkg = JSON.parse(fs.readFileSync(package_json_path))

describe('Hapi server that has registered the hapi-telegram-plugin', () => {
  let server
  const timeout_ms = 10000

  beforeAll(async () => {
    server = makeHapiServer()

    const { chat_id, token } = telegramCredentials()

    const request_event_matchers = [
      {
        name: 'notify of server errors',
        chat_id,
        token,
        predicate: isServerRequestError,
        text: serverError
      },
      {
        name: 'notify of HTTP 401 (Unauthorized) request errors',
        chat_id,
        token,
        predicate: isUnauthorizedRequestError,
        text: unauthorized
      },
      {
        name: `notify of HTTP 418 (I'm a Teapot) request errors`,
        chat_id,
        token,
        predicate: isTeapotRequestError,
        text: teapot
      }
    ]

    await server.register({
      plugin,
      options: { request_event_matchers }
    })
  }, timeout_ms)

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/success'
    })

    expect(res.statusCode).toBe(200)
    expect(res.result.message).toBe('all good')
  })

  it('responds with 500', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/internal'
    })

    expect(res.statusCode).toBe(500)
    expect(res.result.message).toBe('An internal server error occurred')
  })

  it('responds with 501', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/not-implemented'
    })

    expect(res.statusCode).toBe(501)
    expect(res.result.message).toBe('Not Implemented')
  })

  it('responds with 404', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/nonexistent-path'
    })

    expect(res.statusCode).toBe(404)
    expect(res.result.message).toBe('Not Found')
  })

  it('responds with 401', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/unauthorized'
    })

    expect(res.statusCode).toBe(401)
    expect(res.result.message).toBe('Unauthorized')
  })

  it('responds with 418', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/teapot'
    })

    expect(res.statusCode).toBe(418)
    expect(res.result.message).toBe(`I'm a teapot`)
  })
})
