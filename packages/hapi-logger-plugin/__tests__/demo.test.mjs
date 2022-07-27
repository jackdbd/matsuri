import { namespace, testServer } from './utils.mjs'

describe('Hapi app', () => {
  let server
  const timeout_ms = 10000

  const DEBUG_original = process.env.DEBUG
  const HAPI_LOGGER_REQUEST_TAGS_original = process.env.HAPI_LOGGER_REQUEST_TAGS
  const HAPI_LOGGER_SERVER_TAGS_original = process.env.HAPI_LOGGER_SERVER_TAGS

  // TODO: use a Jest spy on server.log() and request.log()

  beforeAll(async () => {
    process.env.DEBUG = namespace
    process.env.HAPI_LOGGER_REQUEST_TAGS = 'error,foo,warning'
    process.env.HAPI_LOGGER_SERVER_TAGS = 'plugin,route'
    server = await testServer()
  }, timeout_ms)

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  afterAll(async () => {
    process.env.DEBUG = DEBUG_original
    process.env.HAPI_LOGGER_REQUEST_TAGS = HAPI_LOGGER_REQUEST_TAGS_original
    process.env.HAPI_LOGGER_SERVER_TAGS = HAPI_LOGGER_SERVER_TAGS_original
  })

  it('responds with 200 for GET /foo', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/foo'
    })

    expect(res.statusCode).toBe(200)
    expect(res.result.message).toBe('got foo')
  })

  it('responds with 200 for GET /bar', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/bar'
    })

    expect(res.statusCode).toBe(200)
    expect(res.result.message).toBe('got bar')
  })

  it('responds with 500', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/internal-error'
    })

    expect(res.statusCode).toBe(500)
    expect(res.result.message).toBe('An internal server error occurred')
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
      url: '/private'
    })

    expect(res.statusCode).toBe(401)
    expect(res.result.message).toBe('Unauthorized')
  })
})
