import { options, DEFAULT_OPTIONS } from '../lib/schemas.js'

describe('options', () => {
  it('can be `undefined` and defaults to the expected object', () => {
    const result = options.validate(undefined)

    expect(result.error).not.toBeDefined()
    expect(result.value).toMatchObject(DEFAULT_OPTIONS)
  })

  it('can be an empty object and defaults to the expected object', () => {
    const result = options.validate({})

    expect(result.error).not.toBeDefined()
    expect(result.value.path).toBe(DEFAULT_OPTIONS.path)
    expect(result.value.response_message_when_healthy).toBe(
      DEFAULT_OPTIONS.response_message_when_healthy
    )
    expect(result.value.response_message_when_unhealthy).toBe(
      DEFAULT_OPTIONS.response_message_when_unhealthy
    )
  })
})
