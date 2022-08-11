import {
  predicate_function,
  telegram_chat_id,
  telegram_bot_token,
  text_function,
  request_event_matcher,
  options
} from '../lib/schemas.js'

describe('predicate_function', () => {
  it('cannot have arity 2', () => {
    const fn = (a, b) => true
    const result = predicate_function.validate(fn)

    expect(result.error).toBeDefined()
  })

  it('must have arity 3', () => {
    const fn = (a, b, c) => true
    const result = predicate_function.validate(fn)

    expect(result.error).not.toBeDefined()
    expect(result.value).toBeDefined()
  })
})

describe('telegram_chat_id', () => {
  it('can be a number', () => {
    const result = telegram_chat_id.validate(123)

    expect(result.error).not.toBeDefined()
    expect(result.value).toBeDefined()
  })

  it('can be a string', () => {
    const result = telegram_chat_id.validate('foo')

    expect(result.error).not.toBeDefined()
    expect(result.value).toBeDefined()
  })

  it('cannot be a boolean', () => {
    const result = telegram_chat_id.validate(true)

    expect(result.error).toBeDefined()
  })
})

describe('telegram_bot_token', () => {
  it('cannot be a number', () => {
    const result = telegram_bot_token.validate(123)

    expect(result.error).toBeDefined()
  })

  it('can be a string', () => {
    const result = telegram_bot_token.validate('foo')

    expect(result.error).not.toBeDefined()
    expect(result.value).toBeDefined()
  })

  it('cannot be a boolean', () => {
    const result = telegram_bot_token.validate(true)

    expect(result.error).toBeDefined()
  })
})

describe('text_function', () => {
  it('cannot have arity 2', () => {
    const fn = (a, b) => true
    const result = text_function.validate(fn)

    expect(result.error).toBeDefined()
  })

  it('must have arity 3', () => {
    const fn = (a, b, c) => true
    const result = text_function.validate(fn)

    expect(result.error).not.toBeDefined()
    expect(result.value).toBeDefined()
  })
})

describe('request_event_matcher', () => {
  it('requires `chat_id`', () => {
    const matcher = {
      name: 'example request event matcher'
    }
    const result = request_event_matcher.validate(matcher)

    expect(result.error).toBeDefined()
    expect(result.error.message).toContain('chat_id')
  })

  it('requires `token`', () => {
    const matcher = {
      name: 'example request event matcher',
      chat_id: 123
    }
    const result = request_event_matcher.validate(matcher)

    expect(result.error).toBeDefined()
    expect(result.error.message).toContain('token')
  })

  it('requires `predicate`', () => {
    const matcher = {
      name: 'example request event matcher',
      chat_id: 123,
      token: 'foo'
    }
    const result = request_event_matcher.validate(matcher)

    expect(result.error).toBeDefined()
    expect(result.error.message).toContain('predicate')
  })

  it('requires `text`', () => {
    const matcher = {
      name: 'example request event matcher',
      chat_id: 123,
      token: 'foo',
      predicate: (a, b, c) => true
    }
    const result = request_event_matcher.validate(matcher)

    expect(result.error).toBeDefined()
    expect(result.error.message).toContain('text')
  })

  it('is valid when every parameter is provided', () => {
    const matcher = {
      name: 'example request event matcher',
      chat_id: 123,
      token: 'foo',
      predicate: (a, b, c) => true,
      text: (a, b, c) => 'Hello World'
    }
    const result = request_event_matcher.validate(matcher)

    expect(result.error).not.toBeDefined()
    expect(result.value).toBeDefined()
  })
})

describe('options', () => {
  it('requires `request_event_matchers`', () => {
    const result = options.validate({})

    expect(result.error).toBeDefined()
    expect(result.error.message).toContain('request_event_matchers')
  })

  it('requires a non-empty `request_event_matchers`', () => {
    const result = options.validate({ request_event_matchers: [] })

    expect(result.error).toBeDefined()
    expect(result.error.message).toContain('request_event_matchers')
    expect(result.error.message).toContain('must contain at least')
  })

  it('is valid when `request_event_matchers` has at least 1 item', () => {
    const matcher = {
      name: 'example request event matcher',
      chat_id: 123,
      token: 'foo',
      predicate: (a, b, c) => true,
      text: (a, b, c) => 'Hello World'
    }
    const result = options.validate({ request_event_matchers: [matcher] })

    expect(result.error).not.toBeDefined()
    expect(result.value).toBeDefined()
  })
})
