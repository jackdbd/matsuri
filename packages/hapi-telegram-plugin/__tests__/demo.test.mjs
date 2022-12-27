import {
  isNotFoundRequestError,
  isServerRequestError,
  isTeapotRequestError,
  isUnauthorizedRequestError
} from '@jackdbd/hapi-request-event-predicates'
import plugin from '../lib/index.js'
import {
  serverError,
  clientError,
  makeGcpCloudRunServiceErrorText
} from '../lib/texts/index.js'
import { makeHapiServer, telegramCredentials } from '../../../scripts/utils.mjs'

const gcpCloudRunServiceErrorText = makeGcpCloudRunServiceErrorText({
  gcp_project_id: 'some-gcp-project',
  cloud_run_service_region_id: 'europe-west3'
})

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
        text: clientError
      },
      {
        name: `notify of HTTP 418 (I'm a Teapot) request errors`,
        chat_id,
        token,
        predicate: isTeapotRequestError,
        text: clientError
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

describe('Hapi server that has registered the hapi-telegram-plugin for a Cloud Run service', () => {
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
        text: gcpCloudRunServiceErrorText
      },
      {
        name: 'notify of HTTP 401 (Unauthorized) request errors',
        chat_id,
        token,
        predicate: isUnauthorizedRequestError,
        text: gcpCloudRunServiceErrorText
      },
      {
        name: 'notify of HTTP 404 (Not Found) request errors',
        chat_id,
        token,
        predicate: isNotFoundRequestError,
        text: gcpCloudRunServiceErrorText
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

  it('responds with 401', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/unauthorized'
    })

    expect(res.statusCode).toBe(401)
    expect(res.result.message).toBe('Unauthorized')
  })

  it('responds with 404', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/nonexistent-path'
    })

    expect(res.statusCode).toBe(404)
    expect(res.result.message).toBe('Not Found')
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
})
