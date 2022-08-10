import Boom from '@hapi/boom'
import Shot from '@hapi/shot'
import { isServerRequestError } from '../lib/index.js'
import { makeDispatch } from './utils.mjs'

describe('isServerRequestError', () => {
  it('is true when `error` is Boom.internal() and `tags` includes both `error` and `handler`', async () => {
    const dispatch = makeDispatch({
      event: { error: Boom.internal() },
      tags: { error: true, handler: true },
      predicate: isServerRequestError
    })

    const res = await Shot.inject(dispatch, {
      method: 'GET',
      url: '/'
    })

    expect(res.payload).toBe('PASSED')
  })

  it('is true when `error` is Boom.notImplemented() and `tags` includes both `error` and `handler`', async () => {
    const dispatch = makeDispatch({
      event: { error: Boom.notImplemented() },
      tags: { error: true, handler: true },
      predicate: isServerRequestError
    })

    const res = await Shot.inject(dispatch, {
      method: 'GET',
      url: '/'
    })

    expect(res.payload).toBe('PASSED')
  })

  it('is true when `error` is Boom.serverUnavailable() and `tags` includes both `error` and `handler`', async () => {
    const dispatch = makeDispatch({
      event: { error: Boom.serverUnavailable() },
      tags: { error: true, handler: true },
      predicate: isServerRequestError
    })

    const res = await Shot.inject(dispatch, {
      method: 'GET',
      url: '/'
    })

    expect(res.payload).toBe('PASSED')
  })

  it('is true when `error` is Boom.badGateway() and `tags` includes both `error` and `handler`', async () => {
    const dispatch = makeDispatch({
      event: { error: Boom.badGateway() },
      tags: { error: true, handler: true },
      predicate: isServerRequestError
    })

    const res = await Shot.inject(dispatch, {
      method: 'GET',
      url: '/'
    })

    expect(res.payload).toBe('PASSED')
  })
})
