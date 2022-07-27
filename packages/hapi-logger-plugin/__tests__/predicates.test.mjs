import { isErrorRequest, shouldLogEvent } from '../lib/predicates.js'

describe('isErrorRequest', () => {
  it('is true when it has both the `error` tag and the `handler` tag', () => {
    const event = { error: new Error('some error message') }
    const tags = { error: true, handler: true }

    expect(isErrorRequest(event, tags)).toBeTruthy()
  })

  it('is false when it does NOT have the `error` tag', () => {
    const event = { error: new Error('some error message') }
    const tags = { handler: true }

    expect(isErrorRequest(event, tags)).toBeFalsy()
  })

  it('is false when it does NOT have the `handler` tag', () => {
    const event = { error: new Error('some error message') }
    const tags = { error: true }

    expect(isErrorRequest(event, tags)).toBeFalsy()
  })
})

describe('shouldLogEvent', () => {
  it('is false when we look for a tag the event is NOT tagged with', () => {
    expect(
      shouldLogEvent({
        event: { tags: ['foo', 'bar'] },
        tags: ['baz']
      })
    ).toBeFalsy()
  })

  it('is true when we look for a tag the event is tagged with', () => {
    expect(
      shouldLogEvent({
        event: { tags: ['foo', 'bar'] },
        tags: ['bar']
      })
    ).toBeTruthy()
  })

  it('is true when the event is tagged with at least one of the tags we are looking for', () => {
    expect(
      shouldLogEvent({
        event: { tags: ['foo'] },
        tags: ['foo', 'bar', 'baz']
      })
    ).toBeTruthy()
  })
})
