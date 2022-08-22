import type Hapi from '@hapi/hapi'
import { send } from '@jackdbd/notifications/telegram'
import { TAG } from './constants.js'
import type { Options, TelegramChatId, TelegramToken } from './interfaces.js'

interface Config extends Required<Options> {
  server: Hapi.Server
}

interface Delivery {
  text: string
  chat_id: TelegramChatId
  token: TelegramToken
}

export const makeHandleRequest = (config: Config) => {
  const { request_event_matchers, server } = config

  const handleRequest: Hapi.RequestEventHandler = async (
    request,
    event,
    tags
  ) => {
    const deliveries: Delivery[] = []

    for (const [idx, matcher] of Object.entries(request_event_matchers)) {
      const i = parseInt(idx, 10)
      server.log(['handler', 'plugin', 'telegram', TAG], {
        message: `check whether request matcher ${i + 1}/${
          request_event_matchers.length
        } matches the predicate`
      })

      if (matcher.predicate(request, event, tags)) {
        deliveries.push({
          text: matcher.text(request, event, tags),
          chat_id: matcher.chat_id,
          token: matcher.token
        })
        // TODO: maybe don't break if flag "allow multiple dispatches" is set?
        break
      }
    }

    const promises = deliveries.map((d) => {
      return send(
        { chat_id: `${d.chat_id}`, token: d.token, text: d.text },
        { disable_web_page_preview: true }
      )
    })

    const results = await Promise.allSettled(promises)

    for (const res of results) {
      if (res.status === 'fulfilled') {
        const { delivered, message } = res.value
        if (!delivered) {
          request.log(['error'], {
            message: `could not deliver message to Telegram chat: ${message}`
          })
        }
      } else {
        const err = res.reason as Error
        request.log(['error'], {
          message: `could not send message to Telegram chat: ${err.message}`
        })
      }
    }
  }

  return handleRequest
}
