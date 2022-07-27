import type Hapi from '@hapi/hapi'
import type { LogData } from '@jackdbd/utils/logger'
import type { ServerEvent, RequestEvent, RequestErrorEvent } from './types.js'

export const serverEventData = (event: ServerEvent): LogData => {
  if (!event.data) {
    return { message: `event with tags [${event.tags.join(', ')}] had no data` }
  }

  if (!event.data.message) {
    return {
      ...event.data,
      message: `event with tags [${event.tags.join(', ')}] had no message`
    }
  }

  return event.data as LogData
}

export const requestEventData = (event: Hapi.RequestEvent): LogData => {
  const ev = event as RequestEvent
  const request_id = ev.request
  if (!ev.data) {
    return {
      message: `event of request ID ${request_id} with tags [${ev.tags.join(
        ', '
      )}] had no data`,
      request_id
    }
  }

  if (!ev.data.message) {
    return {
      ...ev.data,
      message: `event of request ID ${request_id} with tags [${ev.tags.join(
        ', '
      )}] had no message`,
      request_id
    }
  }

  return { ...ev.data, request_id } as LogData
}

export const requestErrorData = (event: Hapi.RequestEvent) => {
  const ev = event as RequestErrorEvent
  const request_id = ev.request
  const message = ev.error.message
  const timestamp = ev.timestamp
  //   const channel = ev.channel
  const statusCode = ev.error.output.statusCode
  // const payload = ev.error.output.payload
  // const headers = ev.error.output.headers
  // const tags = event.tags
  const data = ev.error.data || {}

  return { ...data, message, request_id, timestamp, statusCode }
}
