import {
  makeHapiServer,
  requestEventWithData,
  requestEventWithError
} from '../../../../scripts/utils.mjs'
import { clientError } from '../../lib/texts/index.js'

describe('clientError', () => {
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

  it('contains the expected substrings', async () => {
    const method = 'GET'
    const route_path = '/internal'
    const url = route_path

    const res = await server.inject({ method, url })

    const request = res.request
    const event = requestEventWithData({
      tags: ['foo', 'bar'],
      data: { abc: 'def', answer: 42 }
    })
    const tags = { foo: true, bar: true }

    const s = clientError(request, event, tags)

    expect(s).toContain(method)
    expect(s).toContain(url)
    expect(s).toContain(request.info.id)
    expect(s).toContain(`${event.timestamp}`)
  })
})
