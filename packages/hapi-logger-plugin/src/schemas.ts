import Joi from 'joi'

export interface Options {
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
   * @defaultValue `true`
   */
  should_validate_log_statements?: boolean
}

export const namespace = Joi.string().min(1)

export const DEFAULT_OPTIONS: Options = {
  should_use_emoji_for_severity: true,
  should_validate_log_statements: true
}

export const options = Joi.object<Options>()
  .keys({
    namespace: Joi.string()
      .min(1)
      .description('namespace for the debug logger (unstructured logging)')
      .optional(),

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
