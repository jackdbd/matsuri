import Joi from 'joi'
import type Hapi from '@hapi/hapi'
import Hoek from '@hapi/hoek'
import {
  isOnCloudFunctions,
  isCloudRunJob,
  isCloudRunService
} from '@jackdbd/checks/environment'
import { defaultOptions, PREFIX, TAG } from './constants.js'
import { namespace, tags_schema } from './schemas.js'
import type { Options } from './types.js'
import { makeEventHandlers } from './handlers.js'
import type { MakeLogEventHandlersConfig } from './handlers.js'

const internals = {
  schema: Joi.object().keys({
    namespace: namespace.default(defaultOptions.namespace),
    tags_schema: tags_schema.optional()
  })
}

export const options_schema = Joi.object().keys({
  namespace: Joi.string().min(1).default(defaultOptions.namespace)
})

export const register = async (server: Hapi.Server, options?: Options) => {
  const result = internals.schema.validate(options, {
    allowUnknown: true,
    stripUnknown: true
  })

  Hoek.assert(!result.error, result.error && result.error.annotate())

  if (result.error) {
    const details = result.error.details.map((d) => d.message)
    throw new Error(`${PREFIX} validation error: ${details.join('; ')}`)
  }

  if (result.warning) {
    console.warn(`${PREFIX} warning`, result.warning)
  }

  const request_tags = process.env.HAPI_LOGGER_REQUEST_TAGS
    ? process.env.HAPI_LOGGER_REQUEST_TAGS.split(',')
    : []

  const { error: request_tags_error } = tags_schema.validate(request_tags)
  if (request_tags_error) {
    throw new Error(`${PREFIX} ${request_tags_error.message}`)
  }

  const server_tags = process.env.HAPI_LOGGER_SERVER_TAGS
    ? process.env.HAPI_LOGGER_SERVER_TAGS.split(',')
    : []

  const { error: server_tags_error } = tags_schema.validate(server_tags)
  if (server_tags_error) {
    throw new Error(`${PREFIX} ${server_tags_error.message}`)
  }

  const config: MakeLogEventHandlersConfig = {
    isOnGCP:
      isOnCloudFunctions(process.env) ||
      isCloudRunJob(process.env) ||
      isCloudRunService(process.env),
    namespace: result.value.namespace,
    request_tags,
    server_tags
  }

  if (!config.isOnGCP) {
    if (!process.env.DEBUG) {
      throw new Error(
        `environment variable DEBUG not set. You must set DEBUG if you want to see the logs when the app is running locally (it's not required when running on GCP)`
      )
    }
  }

  const { onLog, onRequest } = makeEventHandlers({
    isOnGCP: config.isOnGCP,
    namespace: config.namespace,
    request_tags: config.request_tags,
    server_tags: config.server_tags
  })

  server.events.on('log', onLog)

  server.log(['plugin', TAG], {
    message: 'Hapi server registered a `log` event handler, i.e. `server.log()`'
  })

  server.events.on('request', onRequest)

  server.log(['plugin', TAG], {
    message:
      'Hapi server registered a `request` event handler, i.e. `request.log()`'
  })
}
