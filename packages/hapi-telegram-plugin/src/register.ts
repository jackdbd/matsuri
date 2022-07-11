import Joi from 'joi'
import type Hapi from '@hapi/hapi'
import Hoek from '@hapi/hoek'
import {
  app_human_readable_name,
  app_technical_name,
  app_version,
  telegram_chat_id,
  telegram_token
} from './schemas.js'
import { makeRequestHandler } from './handlers.js'
import type { Options } from './handlers.js'

const internals = {
  schema: Joi.object().keys({
    app_human_readable_name: app_human_readable_name.default('My App'),
    app_technical_name: app_technical_name.default('my-cloud-run-service-id'),
    app_version: app_version.default('latest'),
    chat_id: telegram_chat_id.required(),
    token: telegram_token.required()
  })
}

export const register = (server: Hapi.Server, options?: Options) => {
  const result = internals.schema.validate(options)
  Hoek.assert(!result.error, result.error && result.error.annotate())

  const config = { ...result.value, server }

  server.events.on('request', makeRequestHandler(config))
  // in alternative, I think I could also do something like this
  // https://github.com/hapijs/scooter/blob/master/lib/index.js

  server.log(['lifecycle'], {
    message: `Hapi server registered the Telegram plugin.`
  })
}
