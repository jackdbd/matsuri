import type Hapi from '@hapi/hapi'
import type Boom from '@hapi/boom'
import type { Tags } from './interfaces.js'

/**
 * @public
 */
export const isServerRequestError = (
  _request: Hapi.Request,
  event: Hapi.RequestEvent,
  tags: Tags
) => {
  if (event.error && tags.error && tags.handler) {
    const boom = event.error as Boom.Boom
    if (boom.isBoom && boom.isServer) {
      return true
    }
  }
  return false
}
