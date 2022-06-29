import { testServer } from './utils.mjs'

describe('GET /', () => {
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

  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/'
    })
    expect(res.statusCode).toBe(404)
  })
})
