import type Hapi from '@hapi/hapi'

export interface Tags {
  [key: string]: true
}

export const isErrorRequest = (event: Hapi.RequestEvent, tags: Tags) => {
  // channel seems to be 'internal' when the Hapi Server throws a HTTP 500 error
  // using Boom.
  // return tags.error && event.channel === 'error'
  return event.error && tags.error && tags.handler
}

interface ShouldLogEventConfig {
  event: Hapi.RequestEvent
  tags: string[]
}

export const shouldLogEvent = ({ event, tags }: ShouldLogEventConfig) => {
  return event.tags.filter((tag) => tags.includes(tag)).length > 0
}
