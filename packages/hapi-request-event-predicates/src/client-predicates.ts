import type Hapi from '@hapi/hapi'
import type Boom from '@hapi/boom'
import type { Tags } from './interfaces.js'

// maybe call this hasRequestEventClientBoomError?

/**
 * @public
 */
export const isClientRequestError = (
  _request: Hapi.Request,
  event: Hapi.RequestEvent,
  tags: Tags
) => {
  if (event.error && tags.error && tags.handler) {
    const boom = event.error as Boom.Boom
    if (boom.isBoom && !boom.isServer) {
      return true
    }
  }
  return false
}

/**
 * @public
 */
export const isBadRequestError = (
  _request: Hapi.Request,
  event: Hapi.RequestEvent,
  _tags: Tags
) => {
  if (event.error) {
    const boom = event.error as Boom.Boom
    if (boom.isBoom && boom.output.statusCode === 400) {
      return true
    }
  }
  return false
}

/**
 * @public
 */
export const isUnauthorizedRequestError = (
  _request: Hapi.Request,
  event: Hapi.RequestEvent,
  _tags: Tags
) => {
  if (event.error) {
    const boom = event.error as Boom.Boom
    if (boom.isBoom && boom.output.statusCode === 401) {
      return true
    }
  }
  return false
}

/**
 * @public
 */
export const isForbiddenRequestError = (
  _request: Hapi.Request,
  event: Hapi.RequestEvent,
  _tags: Tags
) => {
  if (event.error) {
    const boom = event.error as Boom.Boom
    if (boom.isBoom && boom.output.statusCode === 403) {
      return true
    }
  }
  return false
}

/**
 * @public
 */
export const isNotFoundRequestError = (
  _request: Hapi.Request,
  event: Hapi.RequestEvent,
  tags: Tags
) => {
  if (event.error && tags.error && tags.handler) {
    const boom = event.error as Boom.Boom
    if (boom.isBoom && boom.output.statusCode === 404) {
      return true
    }
  }
  return false
}

/**
 * @public
 */
export const isTeapotRequestError = (
  _request: Hapi.Request,
  event: Hapi.RequestEvent,
  _tags: Tags
) => {
  if (event.error) {
    const boom = event.error as Boom.Boom
    if (boom.isBoom && boom.output.statusCode === 418) {
      return true
    }
  }
  return false
}

/**
 * @public
 */
export const hasRequestHeaderStripeSignature = (
  request: Hapi.Request,
  _event: Hapi.RequestEvent,
  _tags: Tags
) => {
  const d = request.headers
  if (d['stripe-signature']) {
    return true
  } else {
    return false
  }
}

/**
 * @public
 */
export const lacksRequestHeaderStripeSignature = (
  request: Hapi.Request,
  _event: Hapi.RequestEvent,
  _tags: Tags
) => {
  const d = request.headers
  if (!d['stripe-signature']) {
    return true
  } else {
    return false
  }
}

/**
 * @public
 */
export const makeHasRequestHeader = (header_key: string) => {
  return function hasRequestHeader(
    request: Hapi.Request,
    _event: Hapi.RequestEvent,
    _tags: Tags
  ) {
    if (request.headers[header_key]) {
      return true
    } else {
      return false
    }
  }
}
