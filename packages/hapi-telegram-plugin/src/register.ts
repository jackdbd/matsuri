import Joi from 'joi'
import type Hapi from '@hapi/hapi'
import { register_options as register_options_schema } from './schemas.js'
import { makeRequestHandler } from './handlers.js'
import type { ConfigMakeRequestHandler, Options } from './handlers.js'

// const DEFAULT: Required<Options> = {
//   path: '/hello'
// }

export const register = async (
  server: Hapi.Server,
  provided_options?: Options
) => {
  Joi.assert(provided_options, register_options_schema)
  // const path = options?.path || DEFAULT.path
  // const { error, value, warning } = register_options_schema.validate(options)
  // console.log('🚀 ~ register ~ error, value, warning', error, value, warning)

  const config: ConfigMakeRequestHandler = {
    app_human_readable_name: 'My Awesome app',
    app_technical_name: 'some-cloud-run-service-id',
    app_version: 'latest',
    chat_id: '',
    server,
    token: ''
  }
  Object.assign(config, provided_options)

  server.events.on('request', makeRequestHandler(config))

  server.log(['lifecycle'], {
    message: `Hapi server registered the Telegram plugin.`
  })
}
