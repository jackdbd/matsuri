import type Hapi from '@hapi/hapi'
import Hoek from '@hapi/hoek'
import { TAG } from './constants.js'
import { healthcheckRoute } from './routes.js'
import { defaultIsHealthy, options as schema } from './schemas.js'
import type { Options } from './schemas.js'

export const register = async (server: Hapi.Server, options?: Options) => {
  const result = schema.validate(options, {
    allowUnknown: true,
    stripUnknown: true
  })

  Hoek.assert(!result.error, result.error && result.error.annotate())

  const {
    path,
    response_message_when_healthy: message_healthy,
    response_message_when_unhealthy: message_unhealthy
  } = result.value as Required<Options>

  const isHealthy = options?.isHealthy || defaultIsHealthy

  server.route(
    healthcheckRoute({
      isHealthy,
      path,
      message_healthy,
      message_unhealthy
    })
  )

  server.log(['plugin', TAG], {
    message: `healthcheck route registered at ${path}`
  })
}
