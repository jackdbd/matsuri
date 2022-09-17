import {
  makeHapiServer,
  requestEventWithData,
  requestEventWithError
} from '../../../../scripts/utils.mjs'
import {
  summaryFromRequest,
  requestHeaders,
  requestId,
  tagsFromEvent,
  timestampFromEvent
} from '../../lib/texts/utils.js'

// Note: it seems crazy to create a Hapi Server to test these function, but I
// tried to use Shot and the request didn't have the `query` and `route` fields.

describe('summaryFromRequest', () => {
  let server
  const timeout_ms = 5000

  beforeAll(async () => {
    server = makeHapiServer()
  })

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  it('contains the HTTP method and the route path', async () => {
    const method = 'GET'
    const route_path = '/internal'
    const url = route_path

    const res = await server.inject({ method, url })

    const s = summaryFromRequest(res.request)

    expect(s).toContain(method)
    expect(s).toContain(url)
  })

  it('contains the HTTP method, the route path and the query string', async () => {
    const method = 'GET'
    const route_path = '/internal'
    // https://hapi.dev/tutorials/routing/?lang=en_US#query
    const qs = 'name=ferris&location=chicago'
    const url = `${route_path}?${qs}`

    const res = await server.inject({ method, url })

    const s = summaryFromRequest(res.request)
    // const auth = res.request.auth
    // const info = res.request.info

    expect(s).toContain(method)
    expect(s).toContain(route_path)
    expect(s).toContain(qs)
  })
})

describe('requestHeaders', () => {
  let server
  const timeout_ms = 5000

  beforeAll(async () => {
    server = makeHapiServer()
  })

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  it('contains the Host request header', async () => {
    const method = 'GET'
    const url = '/success'

    const res = await server.inject({ method, url })

    const s = requestHeaders(res.request)

    expect(s).toContain('Host')
  })

  it('contains the User-Agent request header', async () => {
    const method = 'GET'
    const url = '/success'

    const res = await server.inject({ method, url })

    const s = requestHeaders(res.request)

    expect(s).toContain('User-Agent: shot')
  })
})

describe('requestId', () => {
  let server
  const timeout_ms = 5000

  beforeAll(async () => {
    server = makeHapiServer()
  })

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
  }, timeout_ms)

  it('contains `Request ID` and the request ID', async () => {
    const method = 'GET'
    const url = '/success'

    const res = await server.inject({ method, url })
    const req_id = res.request.info.id

    const s = requestId(res.request)

    expect(s).toContain('Request ID')
    expect(s).toContain(req_id)
  })
})

describe('tagsFromEvent', () => {
  it('contains all event.tags', async () => {
    const event = requestEventWithData({
      tags: ['foo', 'bar'],
      data: { abc: 'def', answer: 42 }
    })

    const s = tagsFromEvent(event)

    expect(s).toContain('Tags')
    expect(s).toContain('foo')
    expect(s).toContain('bar')
  })
})

describe('timestampFromEvent', () => {
  it('contains the word `Timestamp`', async () => {
    const event = requestEventWithData({
      tags: ['foo', 'bar'],
      data: { abc: 'def', answer: 42 }
    })

    const s = timestampFromEvent(event)

    expect(s).toContain('Timestamp')
  })
})
