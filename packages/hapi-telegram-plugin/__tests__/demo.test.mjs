import { testServer } from './utils.mjs'

describe('Hapi app', () => {
  let server
  const timeout_ms = 10000

  beforeAll(async () => {
    server = await testServer()
  }, timeout_ms)

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  // no Telegram message will be delivered to the chat, since this is a success
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/success'
    })

    expect(res.statusCode).toBe(200)
    expect(res.result.message).toBe('all good')
  })

  // a Telegram message will be delivered to the chat, since this is an error
  it('responds with 500', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/internal-error'
    })

    expect(res.statusCode).toBe(500)
    expect(res.result.message).toBe('An internal server error occurred')
  })

  // a Telegram message will be delivered to the chat, since this is an error
  it('responds with 404', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/nonexistent-path'
    })

    expect(res.statusCode).toBe(404)
    expect(res.result.message).toBe('Not Found')
  })

  // a Telegram message will be delivered to the chat, since this is an error
  it('responds with 401', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/private'
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
