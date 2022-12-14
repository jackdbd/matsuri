import type Hapi from '@hapi/hapi'
import type { Tags } from '@jackdbd/hapi-request-event-predicates'

export const defaultTitleFunction = (
  request: Hapi.Request,
  event: Hapi.RequestEvent,
  _tags: Tags
) => {
  const method = request.route.method.toUpperCase()

  const err = event.error as Error

  const what = err.message ? err.message : 'unknown error'
  const where = `${method} ${request.route.path}`

  return `${what} at ${where}`
}

export const defaultBodyFunction = (
  request: Hapi.Request,
  event: Hapi.RequestEvent,
  _tags: Tags
) => {
  const { timestamp } = event

  const method = request.route.method.toUpperCase()
  const req_id = ((event as any).request as string) || 'request ID unknown'
  const date = new Date(timestamp)

  // when, where, what

  let s = [
    `Request ID <code>${req_id}</code> encountered an error.`,
    `Date: ${date} (Unix timestamp ${timestamp}).`,
    `### Route`,
    `<pre><code>${method} ${request.route.path}</pre></code>`
  ].join('\n\n')

  const err = event.error as Error
  if (err.stack) {
    s = s.concat(
      '\n\n',
      `### Stacktrace`,
      '\n\n',
      `<pre><code>${err.stack}</code></pre>`
    )
  } else {
    s = s.concat('\n\n', `### Error message`, '\n\n', err.message)
  }

  return s
}
