import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import plugin from '../lib/index.js'
import { makeHapiServer } from '../../../scripts/utils.mjs'

const NAMESPACE = 'hapi-logger-plugin-tests'

const nop = () => {}

// Note: these tests WOULD print JSON strings since we are using structured
// logging. They are not printing anything because we add a Jest spy and we
// provide a mock implementation for console.log
describe('Hapi server that has registered the hapi-logger-plugin (no options, structured logging)', () => {
  let server
  const spyOnConsoleLog = jest.spyOn(console, 'log')
  spyOnConsoleLog.mockImplementation(nop)
  const timeout_ms = 10000

  beforeAll(async () => {
    server = makeHapiServer()

    // spyOnConsoleLog.mockImplementation(nop)
    await server.register({ plugin })
    expect(spyOnConsoleLog.mock.calls).toHaveLength(2)
    spyOnConsoleLog.mockReset()
  })

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
    spyOnConsoleLog.mockReset()
  }, timeout_ms)

  it('responds with 200 for GET /success', async () => {
    const res = await server.inject({ method: 'GET', url: '/success' })

    expect(res.statusCode).toBe(200)

    expect(spyOnConsoleLog).toHaveBeenCalledTimes(1)

    // https://jestjs.io/docs/mock-function-api#mockfnmockcalls
    // The first (and only) argument of the first (and only) call to console.log
    // is a JSON string (structured logging). That's why we use JSON.parse.
    const first_call_arg0 = JSON.parse(console.log.mock.calls[0][0])

    expect(first_call_arg0).toEqual(
      expect.objectContaining({
        channel: 'app',
        message: 'GET /success',
        request_id: res.request.info.id,
        severity: 'DEBUG',
        tags: ['success']
      })
    )
  })

  // TODO: @jackdbd/tags-logger should log only events of the `app` channel.
  // When @jackdbd/tags-logger will implement this change, there should be only
  // 1 call to console.log instead of 3.
  it('responds with 500 for /internal', async () => {
    const res = await server.inject({ method: 'GET', url: '/internal' })

    expect(res.statusCode).toBe(500)
    expect(res.result.message).toBe('An internal server error occurred')

    expect(spyOnConsoleLog).toHaveBeenCalledTimes(3)

    const first_call_arg0 = JSON.parse(console.log.mock.calls[0][0])
    const second_call_arg0 = JSON.parse(console.log.mock.calls[1][0])
    const third_call_arg0 = JSON.parse(console.log.mock.calls[2][0])

    expect(first_call_arg0).toEqual(
      expect.objectContaining({
        channel: 'app',
        message: 'GET /internal',
        request_id: res.request.info.id,
        severity: 'ERROR',
        tags: ['internal']
      })
    )

    expect(second_call_arg0).toEqual(
      expect.objectContaining({
        channel: 'internal',
        message: 'NO event.data.message',
        request_id: res.request.info.id,
        severity: 'ERROR',
        tags: ['handler']
      })
    )

    expect(third_call_arg0).toEqual(
      expect.objectContaining({
        channel: 'error',
        message: 'NO event.data.message',
        request_id: res.request.info.id,
        severity: 'ERROR',
        tags: ['internal']
      })
    )
  })
})

describe('Hapi server that has registered the hapi-logger-plugin (unstructured logging, emoji)', () => {
  let server
  const timeout_ms = 10000

  beforeAll(async () => {
    server = makeHapiServer()

    await server.register({
      plugin,
      options: { namespace: NAMESPACE }
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
      options: { namespace: NAMESPACE, should_use_emoji_for_severity: false }
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
