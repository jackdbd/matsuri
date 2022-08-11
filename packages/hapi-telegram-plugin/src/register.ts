import type Hapi from '@hapi/hapi'
import Hoek from '@hapi/hoek'
import {
  isServerRequestError,
  isUnauthorizedRequestError
} from '@jackdbd/hapi-request-event-predicates'
import { options as schema } from './schemas.js'
import { makeHandleRequest } from './handlers.js'
import type { Options, RequestEventMatcher } from './interfaces.js'
import { serverError, unauthorized } from './texts.js'

const telegramCredentialsFromEnvironment = () => {
  if (!process.env.TELEGRAM_CHAT_ID) {
    throw new Error(`TELEGRAM_CHAT_ID not set`)
  }
  const chat_id = process.env.TELEGRAM_CHAT_ID

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error(`TELEGRAM_BOT_TOKEN not set`)
  }
  const token = process.env.TELEGRAM_BOT_TOKEN

  return { chat_id, token }
}

const defaultRequestEventMatchers = (): RequestEventMatcher[] => {
  const { chat_id, token } = telegramCredentialsFromEnvironment()

  return [
    {
      name: 'notify of server errors',
      chat_id,
      token,
      predicate: isServerRequestError,
      text: serverError
    },
    {
      name: 'warn about HTTP 401 (Unauthorized) request errors',
      chat_id,
      token,
      predicate: isUnauthorizedRequestError,
      text: unauthorized
    }
  ]
}

export const register = (server: Hapi.Server, options?: Options) => {
  // consider using Hoek.merge() or Hoek.applyToDefaults()
  // https://hapi.dev/module/hoek/api/?v=10.0.0#mergetarget-source-options
  // https://hapi.dev/module/hoek/api/?v=10.0.0#applytodefaultsdefaults-source-options
  let config: Required<Options>
  if (options) {
    if (options.request_event_matchers) {
      config = {
        ...options,
        request_event_matchers: options.request_event_matchers
      }
    } else {
      config = {
        ...options,
        request_event_matchers: defaultRequestEventMatchers()
      }
    }
  } else {
    config = {
      request_event_matchers: defaultRequestEventMatchers()
    }
  }

  const result = schema.validate(config)
  Hoek.assert(!result.error, result.error && result.error.annotate())

  const handleRequest = makeHandleRequest({ ...config, server })

  server.events.on('request', handleRequest)

  server.log(['lifecycle', 'plugin', 'telegram', 'hapi-telegram-plugin'], {
    message: `Hapi server registered the Telegram plugin.`
  })
}
