import {
  isServerRequestError,
  isTeapotRequestError
} from '@jackdbd/hapi-request-event-predicates'
import plugin from '../lib/index.js'
import { makeHapiServer, githubToken } from '../../../scripts/utils.mjs'

describe('Hapi server that has registered the hapi-github-issue-plugin (minimal config)', () => {
  let server
  const timeout_ms = 10000

  beforeAll(async () => {
    server = makeHapiServer()

    await server.register({
      plugin,
      options: { token: githubToken() }
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
})

describe('Hapi server that has registered the hapi-github-issue-plugin (custom config)', () => {
  let server
  const timeout_ms = 10000

  beforeAll(async () => {
    server = makeHapiServer()

    const request_event_matchers = [
      {
        predicate: isServerRequestError,
        title: (request, event, tags) => {
          return `Test issue title (internal)`
        },
        body: (request, event, tags) => {
          return `Test issue body (internal)`
        },
        assignees: ['jackdbd'],
        // milestone: 1,
        labels: ['bug', 'test']
      },
      {
        predicate: isTeapotRequestError,
        title: (request, event, tags) => {
          return `Test issue title (teapot)`
        },
        body: (request, event, tags) => {
          return `Test issue body (teapot)`
        },
        assignees: ['jackdbd'],
        labels: ['teapot', 'test']
      }
    ]

    await server.register({
      plugin,
      options: { request_event_matchers, token: githubToken() }
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

  it('responds with 418', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/teapot'
    })

    expect(res.statusCode).toBe(418)
    expect(res.result.message).toBe(`I'm a teapot`)
  })
})
