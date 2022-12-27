import type Hapi from '@hapi/hapi'
import type { Tags } from '@jackdbd/hapi-request-event-predicates'
import {
  summaryFromRequest,
  requestHeaders,
  requestId,
  tagsFromEvent,
  timestampFromEvent
} from './utils.js'

/**
 * @public
 */
export const serverError = (
  request: Hapi.Request,
  event: Hapi.RequestEvent,
  _tags: Tags
) => {
  let s = `<b>${summaryFromRequest(request)}</b>`
  s = `${s}\n\n${requestId(request)}`
  s = `${s}\n\n${timestampFromEvent(event)}`
  s = `${s}\n\n${tagsFromEvent(event)}`
  s = `${s}\n\n${requestHeaders(request)}`

  return s
}
