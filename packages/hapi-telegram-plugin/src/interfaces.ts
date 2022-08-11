import type Hapi from '@hapi/hapi'
import type { Tags } from '@jackdbd/hapi-request-event-predicates'

/**
 * @public
 */
export type TelegramChatId = number | string

/**
 * @public
 */
export type TelegramToken = string

/**
 * @public
 */
export interface RequestEventMatcher {
  name: string

  chat_id: TelegramChatId

  token: TelegramToken

  text: (request: Hapi.Request, event: Hapi.RequestEvent, tags: Tags) => string

  predicate: (
    request: Hapi.Request,
    event: Hapi.RequestEvent,
    tags: Tags
  ) => boolean
}

/**
 * @public
 */
export interface Options {
  request_event_matchers?: RequestEventMatcher[]
}
