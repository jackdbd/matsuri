import type { Request, RequestEvent } from '@hapi/hapi'

/**
 * @internal
 */
export const summaryFromRequest = (request: Request) => {
  const { query, route } = request

  let qs: string | undefined = undefined
  if (query) {
    qs = Object.entries(query).reduce((acc, [k, v]) => {
      if (acc) {
        // https://hapi.dev/tutorials/routing/?lang=en_US#query
        return `${acc}&${k}=${v}`
      } else {
        return `${k}=${v}`
      }
    }, '')
  }

  return qs
    ? `${route.method.toUpperCase()} ${route.path}?${qs}`
    : `${route.method.toUpperCase()} ${route.path}`
}

/**
 * @internal
 */
export const tagsFromEvent = (event: RequestEvent) => {
  return `Tags:\n${event.tags.join(', ')}`
}

/**
 * @internal
 */
export const timestampFromEvent = (event: RequestEvent) => {
  const timestamp = event.timestamp

  return `Timestamp:\n<code>${timestamp}</code> (${new Date(
    timestamp
  ).toUTCString()})`
}

/**
 * @internal
 */
export const requestId = (request: Request) => {
  // const request_id = (event as any).request || 'unknown request id'
  const request_id = request.info.id
  return `Request ID:\n<code>${request_id}</code>`
}

/**
 * @internal
 */
export const requestHeaders = (request: Request) => {
  if (!request.headers) {
    return ''
  }

  const headers: string[] = []

  const cache_control = request.headers['cache-control']
  if (cache_control) {
    headers.push(`Cache-Control: ${cache_control}`)
  }

  const host = request.headers['host']
  if (host) {
    headers.push(`Host: ${host}`)
  }

  const user_agent = request.headers['user-agent']
  if (user_agent) {
    headers.push(`User-Agent: ${user_agent}`)
  }

  return `Request headers:\n<pre>${headers.join('\n\n')}</pre>`
}
