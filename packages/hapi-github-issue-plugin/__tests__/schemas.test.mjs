import { github_token, request_event_matcher, options } from '../lib/schemas.js'

describe('github_token', () => {
  it('cannot be a number', () => {
    const result = github_token.validate(123)

    expect(result.error).toBeDefined()
  })

  it('cannot be a boolean', () => {
    const result = github_token.validate(true)

    expect(result.error).toBeDefined()
  })

  it('can be a string', () => {
    const result = github_token.validate('foo')

    expect(result.error).not.toBeDefined()
    expect(result.value).toBeDefined()
  })
})

describe('request_event_matcher', () => {
  it('requires `predicate`', () => {
    const matcher = {}
    const result = request_event_matcher.validate(matcher)

    expect(result.error).toBeDefined()
    expect(result.error.message).toContain('predicate')
  })
})

describe('options', () => {
  it('can be `undefined`', () => {
    const result = options.validate(undefined)

    expect(result.error).not.toBeDefined()
  })

  it('can be an empty object', () => {
    const result = options.validate({})

    expect(result.error).not.toBeDefined()
  })
})
