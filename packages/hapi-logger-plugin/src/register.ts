import type Hapi from '@hapi/hapi'
import Hoek from '@hapi/hoek'
import { TAG } from './constants.js'
import { makeOnLog, makeOnRequest } from './handlers.js'
import { options as schema } from './schemas.js'
import type { Options } from './schemas.js'

export const register = async (server: Hapi.Server, options?: Options) => {
  const result = schema.validate(options, {
    allowUnknown: true,
    stripUnknown: true
  })
  Hoek.assert(!result.error, result.error && result.error.annotate())

  const {
    namespace,
    should_use_emoji_for_severity,
    should_validate_log_statements
  } = result.value as Required<Options>

  const onLog = makeOnLog({
    namespace: namespace ? `${namespace}/log-event` : undefined,
    should_use_emoji_for_severity,
    should_validate_log_statements
  })

  server.events.on('log', onLog)
  server.log(['debug', 'plugin', TAG], {
    message: 'Hapi server registered a `log` event handler, i.e. `server.log()`'
  })

  const onRequest = makeOnRequest({
    namespace: namespace ? `${namespace}/request-event` : undefined,
    should_use_emoji_for_severity,
    should_validate_log_statements
  })

  server.events.on('request', onRequest)
  server.log(['debug', 'plugin', TAG], {
    message:
      'Hapi server registered a `request` event handler, i.e. `request.log()`'
  })
}
