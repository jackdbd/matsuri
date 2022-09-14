/**
 * Functions that check whether a Hapi request event contains one or more of the
 * following things:
 *
 * - errors
 * - headers
 * - tags
 *
 * @packageDocumentation
 */

export {
  hasRequestHeaderStripeSignature,
  isBadRequestError,
  isClientRequestError,
  isForbiddenRequestError,
  isNotFoundRequestError,
  isTeapotRequestError,
  isUnauthorizedRequestError,
  lacksRequestHeaderStripeSignature,
  makeHasRequestHeader
} from './client-predicates.js'

export { isServerRequestError } from './server-predicates.js'

export type { Tags } from './interfaces.js'
