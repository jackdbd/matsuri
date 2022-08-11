import plugin from '../lib/index.js'
import { makeHapiServer } from '../../../scripts/utils.mjs'

describe('Hapi server that has registered the hapi-logger-plugin (no options, structured logging)', () => {
  let server
  const timeout_ms = 10000

  // TODO: use a Jest spy on server.log() and request.log()

  beforeAll(async () => {
    server = makeHapiServer()

    await server.register({ plugin })
  })

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  it('responds with 200 for GET /success', async () => {
    const res = await server.inject({ method: 'GET', url: '/success' })

    expect(res.statusCode).toBe(200)
  })

  it('responds with 500 for /internal', async () => {
    const res = await server.inject({ method: 'GET', url: '/internal' })

    expect(res.statusCode).toBe(500)
    expect(res.result.message).toBe('An internal server error occurred')
  })
})

describe('Hapi server that has registered the hapi-logger-plugin (unstructured logging, emoji)', () => {
  let server
  const timeout_ms = 10000

  beforeAll(async () => {
    server = makeHapiServer()

    await server.register({
      plugin,
      options: { namespace: 'demo-app' }
    })
  })

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  it('responds with 200 for GET /success', async () => {
    const res = await server.inject({ method: 'GET', url: '/success' })

    expect(res.statusCode).toBe(200)
  })

  it('responds with 500 for /internal', async () => {
    const res = await server.inject({ method: 'GET', url: '/internal' })

    expect(res.statusCode).toBe(500)
    expect(res.result.message).toBe('An internal server error occurred')
  })
})

describe('Hapi server that has registered the hapi-logger-plugin (unstructured logging, severity tag)', () => {
  let server
  const timeout_ms = 10000

  beforeAll(async () => {
    server = makeHapiServer()

    await server.register({
      plugin,
      options: { namespace: 'demo-app', should_use_emoji_for_severity: false }
    })
  })

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  it('responds with 200 for GET /success', async () => {
    const res = await server.inject({ method: 'GET', url: '/success' })

    expect(res.statusCode).toBe(200)
  })

  it('responds with 500 for /internal', async () => {
    const res = await server.inject({ method: 'GET', url: '/internal' })

    expect(res.statusCode).toBe(500)
    expect(res.result.message).toBe('An internal server error occurred')
  })
})
