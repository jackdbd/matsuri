import Boom from '@hapi/boom'
import { CHARACTER_LIMIT_TELEGRAM_MESSAGE } from '../lib/constants.js'
import { badRequest, unauthorized, serverError } from '../lib/texts.js'
import { requestId, timestampMs } from '../../../scripts/utils.mjs'

// TODO: consider writing a function to avoid duplicate code in these tests

describe('badRequest', () => {
  const request = { route: { method: 'get', path: '/' } }

  const request_id = requestId()
  const timestamp = timestampMs()
  const event = {
    error: Boom.badRequest(),
    request: request_id,
    timestamp,
    tags: ['error', 'handler']
  }

  const tags = { error: true, handler: true }

  it('contains the method (uppercase) and path of the HTTP request', async () => {
    const text = badRequest(request, event, tags)
    const { route } = request
    const method_path = `${route.method.toUpperCase()} ${route.path}`

    expect(text).toContain(method_path)
  })

  it('contains `400`', async () => {
    const request = { route: { method: 'get', path: '/' } }
    const event = { error: Boom.badRequest(), tags: ['error', 'handler'] }
    const tags = { error: true, handler: true }

    const text = badRequest(request, event, tags)
    expect(text).toContain('400')
  })

  it('contains `Unauthorized`', async () => {
    const request = { route: { method: 'get', path: '/' } }
    const event = { error: Boom.badRequest(), tags: ['error', 'handler'] }
    const tags = { error: true, handler: true }

    const text = badRequest(request, event, tags)
    expect(text).toContain('Bad Request')
  })
})

describe('unauthorized', () => {
  const request = { route: { method: 'get', path: '/' } }

  const request_id = requestId()
  const timestamp = timestampMs()
  const event = {
    error: Boom.unauthorized(),
    request: request_id,
    timestamp,
    tags: ['error', 'handler']
  }

  const tags = { error: true, handler: true }

  it(`is less than ${CHARACTER_LIMIT_TELEGRAM_MESSAGE} characters (limit for a Telegram message)`, async () => {
    const text = unauthorized(request, event, tags)

    expect(text.length).toBeLessThan(CHARACTER_LIMIT_TELEGRAM_MESSAGE)
  })

  it('contains the request ID of the event', async () => {
    const text = unauthorized(request, event, tags)

    expect(text).toContain(request_id)
  })

  it('contains the timestamp of the event', async () => {
    const text = unauthorized(request, event, tags)

    expect(text).toContain(`${timestamp}`)
  })

  it('contains all the tags of the event', async () => {
    const text = unauthorized(request, event, tags)

    event.tags.forEach((tag) => {
      expect(text).toContain(tag)
    })
  })

  it('contains the method (uppercase) and path of the HTTP request', async () => {
    const text = unauthorized(request, event, tags)
    const { route } = request
    const method_path = `${route.method.toUpperCase()} ${route.path}`

    expect(text).toContain(method_path)
  })

  it('contains `401`', async () => {
    const request = { route: { method: 'get', path: '/' } }
    const event = { error: Boom.unauthorized(), tags: ['error', 'handler'] }
    const tags = { error: true, handler: true }

    const text = unauthorized(request, event, tags)
    expect(text).toContain('401')
  })

  it('contains `Unauthorized`', async () => {
    const request = { route: { method: 'get', path: '/' } }
    const event = { error: Boom.unauthorized(), tags: ['error', 'handler'] }
    const tags = { error: true, handler: true }

    const text = unauthorized(request, event, tags)
    expect(text).toContain('Unauthorized')
  })
})

describe('serverError', () => {
  const request = { route: { method: 'get', path: '/' } }

  const request_id = requestId()
  const timestamp = timestampMs()
  const event = {
    error: Boom.internal(),
    request: request_id,
    timestamp,
    tags: ['error', 'handler']
  }

  const tags = { error: true, handler: true }

  it(`is less than ${CHARACTER_LIMIT_TELEGRAM_MESSAGE} characters (limit for a Telegram message)`, async () => {
    const text = serverError(request, event, tags)

    expect(text.length).toBeLessThan(CHARACTER_LIMIT_TELEGRAM_MESSAGE)
  })

  it('contains the request ID of the event', async () => {
    const text = serverError(request, event, tags)

    expect(text).toContain(request_id)
  })

  it('contains the timestamp of the event', async () => {
    const text = serverError(request, event, tags)

    expect(text).toContain(`${timestamp}`)
  })

  it('contains all the tags of the event', async () => {
    const text = serverError(request, event, tags)

    event.tags.forEach((tag) => {
      expect(text).toContain(tag)
    })
  })

  it('contains the method (uppercase) and path of the HTTP request', async () => {
    const text = serverError(request, event, tags)
    const { route } = request
    const method_path = `${route.method.toUpperCase()} ${route.path}`

    expect(text).toContain(method_path)
  })
})
