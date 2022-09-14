import Boom from '@hapi/boom'
import Shot from '@hapi/shot'
import {
  isBadRequestError,
  isClientRequestError,
  isForbiddenRequestError,
  isUnauthorizedRequestError,
  makeHasRequestHeader
} from '../lib/index.js'
import { makeDispatch } from '../../../scripts/utils.mjs'

describe('isClientRequestError', () => {
  it('is true when `error` is Boom.notFound() and `tags` includes both `error` and `handler`', async () => {
    const dispatch = makeDispatch({
      event: { error: Boom.notFound() },
      tags: { error: true, handler: true },
      predicate: isClientRequestError
    })

    const res = await Shot.inject(dispatch, {
      method: 'GET',
      url: '/'
    })

    expect(res.payload).toBe('PASSED')
  })

  it('is true when `error` is Boom.tooManyRequests() and `tags` includes both `error` and `handler`', async () => {
    const dispatch = makeDispatch({
      event: { error: Boom.tooManyRequests() },
      tags: { error: true, handler: true },
      predicate: isClientRequestError
    })

    const res = await Shot.inject(dispatch, {
      method: 'GET',
      url: '/'
    })

    expect(res.payload).toBe('PASSED')
  })
})

describe('isBadRequestError', () => {
  it('is true when `error` is Boom.badRequest() and `tags` includes both `error` and `handler`', async () => {
    const dispatch = makeDispatch({
      event: { error: Boom.badRequest() },
      tags: { error: true, handler: true },
      predicate: isBadRequestError
    })

    const res = await Shot.inject(dispatch, {
      method: 'GET',
      url: '/'
    })

    expect(res.payload).toBe('PASSED')
  })
})

describe('isUnauthorizedRequestError', () => {
  it('is true when `error` is Boom.unauthorized() and `tags` includes both `error` and `handler`', async () => {
    const dispatch = makeDispatch({
      event: { error: Boom.unauthorized() },
      tags: { error: true, handler: true },
      predicate: isUnauthorizedRequestError
    })

    const res = await Shot.inject(dispatch, {
      method: 'GET',
      url: '/'
    })

    expect(res.payload).toBe('PASSED')
  })
})

describe('isForbiddenRequestError', () => {
  it('is true when `error` is Boom.forbidden() and `tags` includes both `error` and `handler`', async () => {
    const dispatch = makeDispatch({
      event: { error: Boom.forbidden() },
      tags: { error: true, handler: true },
      predicate: isForbiddenRequestError
    })

    const res = await Shot.inject(dispatch, {
      method: 'GET',
      url: '/'
    })

    expect(res.payload).toBe('PASSED')
  })
})

describe('has custom request header', () => {
  it('is true when request has the specified request header', async () => {
    const header_key = `request-header-${Math.floor(Math.random() * 1000)}`

    const hasCustomRequestHeader = makeHasRequestHeader(header_key)

    const dispatch = makeDispatch({
      event: { error: undefined },
      tags: { handler: true },
      predicate: hasCustomRequestHeader
    })

    const res = await Shot.inject(dispatch, {
      method: 'GET',
      url: '/',
      headers: { [header_key]: 'some value' }
    })

    expect(res.payload).toBe('PASSED')
  })
})
