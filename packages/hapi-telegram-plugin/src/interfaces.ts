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
 * Rule that controls which request matches, and to which Telegram chat the text
 * should be sent.
 *
 * The rule `predicate` determines whether a request matches or not.
 *
 * The rule `text` converts the combination request and event into a text to
 * send to Telegram. This text should respect the formatting options and length
 * allowed by the sendMessage endpoint of the Telegram API.
 *
 * @see [sendMessage - Telegram Bot API](https://core.telegram.org/bots/api#sendmessage)
 * @see [Formatting options - Telegram Bot API](https://core.telegram.org/bots/api#formatting-options)
 *
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
