import type { RequestEvent } from '@hapi/hapi'

export interface Tags {
  [key: string]: true
}

export const isErrorRequest = (_event: RequestEvent, tags: Tags) => {
  // channel seems to be 'internal' when the Hapi Server throws a HTTP 500 error
  // using Boom.
  // return tags.error && event.channel === 'error'
  return tags.error && tags.handler
}
