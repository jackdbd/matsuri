import type Hapi from '@hapi/hapi'
import { send } from '@jackdbd/notifications/telegram'
import { errorText } from '@jackdbd/telegram-text-messages'
import type { TelegramChatId, TelegramToken } from './types.js'
import { isErrorRequest } from './predicates.js'

export interface ConfigErrorRequestHandler {
  app_human_readable_name: string
  app_technical_name: string
  app_version: string
  chat_id: TelegramChatId
  error_message: string
  request: Hapi.Request
  token: TelegramToken
}

export interface Options {
  app_human_readable_name: string
  app_technical_name: string
  app_version: string
  chat_id: TelegramChatId
  token: TelegramToken
}

export interface ConfigMakeRequestHandler extends Options {
  server: Hapi.Server
}

const handleRequestError = async ({
  app_human_readable_name,
  app_technical_name,
  app_version,
  chat_id,
  error_message,
  request,
  token
}: ConfigErrorRequestHandler) => {
  const app_name = `${app_human_readable_name} (${app_technical_name})`

  const { route } = request

  const method_path = `${route.method.toUpperCase()} ${route.path}`

  try {
    const { delivered } = await send({
      chat_id: chat_id as string,
      token,
      text: errorText({
        app_name,
        app_version,
        error_message,
        error_title: `request error at ${method_path}`
      })
    })

    if (!delivered) {
      request.log(['error'], {
        message: `could not deliver message to Telegram chat ID ${chat_id}. Double check you chat ID and token`
      })
    }
  } catch (err: any) {
    request.log(['error'], {
      message: `could not send message to Telegram chat ID ${chat_id}: ${err.message}`
    })
  }
}

export const makeRequestHandler = (config: ConfigMakeRequestHandler) => {
  const {
    app_human_readable_name,
    app_technical_name,
    app_version,
    chat_id,
    server,
    token
  } = config

  server.log(['lifecycle'], {
    message: `Hapi Telegram plugin will send messages to the Telegram chat ID ${chat_id}`
  })

  const handleRequest: Hapi.RequestEventHandler = async (
    request,
    event,
    tags
  ) => {
    // is this check enough? Note: this could be a configurable predicate (e.g. `shouldHandle`)
    if (isErrorRequest(event, tags)) {
      const request_id = (event as any).request || 'unknown request id'
      const timestamp = event.timestamp

      let error_message = 'Generic error'
      if ((event.error as any).isBoom) {
        error_message = (event.error as any).output.payload.message
      } else {
        error_message = 'not a Boom error' // what to do?
      }
      error_message = `${error_message} (request id: ${request_id} - timestamp ${timestamp})`

      await handleRequestError({
        app_human_readable_name,
        app_technical_name,
        app_version,
        chat_id,
        token,
        error_message,
        request
      })
    } else {
      // all other events are not handled by this plugin
    }
  }

  return handleRequest
}
