import { namespace, options, DEFAULT_OPTIONS } from '../lib/schemas.js'

describe('options', () => {
  it('can be `undefined` and defaults to the expected object', () => {
    const result = options.validate(undefined)

    expect(result.error).not.toBeDefined()
    expect(result.value).toMatchObject(DEFAULT_OPTIONS)
  })

  it('can be an empty object and defaults to the expected object', () => {
    const result = options.validate({})

    expect(result.error).not.toBeDefined()
    expect(result.value).toMatchObject(DEFAULT_OPTIONS)
  })
})

describe('namespace', () => {
  it('can be `undefined`', () => {
    const result = namespace.validate(undefined)

    expect(result.error).not.toBeDefined()
    expect(result.value).toBe(undefined)
  })

  it('cannot be an empty string', () => {
    const result = namespace.validate('')

    expect(result.error).toBeDefined()
  })
})
