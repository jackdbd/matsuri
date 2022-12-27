import Joi from 'joi'

/**
 * Options for this Hapi plugin.
 *
 * @public
 */
export interface Options {
  /**
   * The event channels you want to log.
   *
   * @defaultValue `['app']`
   *
   * @see [Hapi 'log' Event](https://hapi.dev/api/?v=21.0.0-beta.1#-log-event)
   * @see [Hapi 'request' Event](https://hapi.dev/api/?v=21.0.0-beta.1#-request-event)
   * @see [podium](https://hapi.dev/module/podium/)
   */
  channels?: string[]

  /**
   * The namespace for the debug logger (unstructured logging).
   * This option has no effect when using structured logging.
   *
   * @defaultValue `undefined`
   */
  namespace?: string

  /**
   * Whether to use an emoji for the severity level (unstructured logging).
   * This option has no effect when using structured logging.
   *
   * @defaultValue `true`
   */
  should_use_emoji_for_severity?: boolean

  /**
   * Whether each log statement should be validated against a Joi schema.
   *
   * @defaultValue `false` when `NODE_ENV` is `'production'`, `true` otherwise.
   */
  should_validate_log_statements?: boolean
}

export const channel = Joi.string().min(1)

export const channels = Joi.array()
  .items(channel)
  .min(1)
  .description('event channels to log')

export const namespace = Joi.string()
  .min(1)
  .description('namespace for the debug logger (unstructured logging)')

export const DEFAULT_OPTIONS: Options = {
  channels: ['app'],
  should_use_emoji_for_severity: true,
  should_validate_log_statements:
    process.env.NODE_ENV === 'production' ? false : true
}

export const options = Joi.object<Options>()
  .keys({
    channels: channels.optional().default(DEFAULT_OPTIONS.channels),

    namespace: namespace.optional(),

    should_use_emoji_for_severity: Joi.boolean()
      .description(
        'whether to use an emoji for the severity level (unstructured logging)'
      )
      .optional()
      .default(DEFAULT_OPTIONS.should_use_emoji_for_severity),

    should_validate_log_statements: Joi.boolean()
      .description(
        'whether each log statement should be validated against a Joi schema'
      )
      .optional()
      .default(DEFAULT_OPTIONS.should_validate_log_statements)
  })
  .default(DEFAULT_OPTIONS)
