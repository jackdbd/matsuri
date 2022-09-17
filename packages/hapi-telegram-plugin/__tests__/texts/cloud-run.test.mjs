import Boom from '@hapi/boom'
import {
  makeHapiServer,
  requestEventWithData,
  requestEventWithError
} from '../../../../scripts/utils.mjs'
import { makeGcpCloudRunServiceErrorText } from '../../lib/texts/index.js'

const gcpCloudRunServiceErrorText = makeGcpCloudRunServiceErrorText({
  gcp_project_id: 'some-gcp-project',
  cloud_run_service_region_id: 'europe-west3'
})

describe('gcpCloudRunServiceErrorText', () => {
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

  it('contains the expected substrings (event with error and no data)', async () => {
    const method = 'GET'
    const route_path = '/not-implemented'
    const url = route_path

    const res = await server.inject({ method, url })

    const request = res.request
    const event = requestEventWithError({
      tags: ['error', 'handler'],
      error: Boom.notImplemented()
    })
    const tags = { error: true, handler: true }

    const s = gcpCloudRunServiceErrorText(request, event, tags)

    expect(s).toContain('Cloud Run service')
    expect(s).toContain('Revision')
    expect(s).toContain(method)
    expect(s).toContain(url)
    expect(s).toContain(request.info.id)
    expect(s).toContain(`${event.timestamp}`)
  })

  it('contains the expected substrings (event with data and no error)', async () => {
    const method = 'GET'
    const route_path = '/not-implemented'
    const url = route_path

    const res = await server.inject({ method, url })

    const request = res.request
    const event = requestEventWithData({
      tags: ['test', 'handler'],
      data: { abc: 'def', answer: 42 }
    })
    const tags = { test: true, handler: true }

    const s = gcpCloudRunServiceErrorText(request, event, tags)

    expect(s).toContain('Cloud Run service')
    expect(s).toContain('Revision')
    expect(s).toContain(method)
    expect(s).toContain(url)
  })
})
