import Joi from 'joi'

export interface Options {
  /**
   * Promise-returning function that checks if the service is healthy or not.
   */
  isHealthy?: () => Promise<boolean>

  /**
   * Route path for the healthcheck.
   */
  path?: string

  /**
   * Message for when the service is healthy.
   */
  response_message_when_healthy?: string

  /**
   * Message for when the service is not healthy.
   */
  response_message_when_unhealthy?: string
}

export const is_healthy_func = Joi.function().arity(0)

export const path_schema = Joi.string().min(1)

export const response_message = Joi.string().min(1)

export const response_message_when_healthy_schema = Joi.string().min(1)

export const response_message_when_unhealthy_schema = Joi.string().min(1)

export const defaultIsHealthy = async () => true

export const DEFAULT_OPTIONS: Options = {
  isHealthy: defaultIsHealthy,
  path: '/health',
  response_message_when_healthy: 'server is healthy',
  response_message_when_unhealthy: 'server is unhealthy'
}

export const options = Joi.object<Options>()
  .keys({
    isHealthy: is_healthy_func
      .description(
        'promise-returning function that checks if the service is healthy or not.'
      )
      .optional(),

    path: path_schema
      .description('route path for the healthcheck.')
      .optional()
      .default(DEFAULT_OPTIONS.path),

    response_message_when_healthy: response_message
      .description('message for when the service is healthy.')
      .optional()
      .default(DEFAULT_OPTIONS.response_message_when_healthy),

    response_message_when_unhealthy: response_message
      .description('message for when the service is unhealthy.')
      .optional()
      .default(DEFAULT_OPTIONS.response_message_when_unhealthy)
  })
  .default(DEFAULT_OPTIONS)
