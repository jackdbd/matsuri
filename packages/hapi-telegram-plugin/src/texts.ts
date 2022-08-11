import type Hapi from '@hapi/hapi'
import type { Tags } from '@jackdbd/hapi-request-event-predicates'
import { CHARACTER_LIMIT_TELEGRAM_MESSAGE, Emoji } from './constants.js'

interface Link {
  href: string
  text: string
}

// https://core.telegram.org/bots/api#formatting-options

// https://cloud.google.com/run/docs/container-contract#services-env-vars
const TITLE = process.env.K_SERVICE || `Hapi app (K_SERVICE env. var. not set)`

const SUBTITLE = process.env.K_REVISION
  ? `revision: ${process.env.K_REVISION}`
  : `revision: unknown (K_REVISION env. var. not set)`

// e.g. link to Cloud Logging query for this Hapi request ID
// const CLOUD_RUN_LOGS_HREF = `https://console.cloud.google.com/run/detail/${region_id}/${process.env.K_SERVICE}/logs?project=${project_id}`

const summaryFromRequest = (request: Hapi.Request) => {
  const { query, route } = request

  let s = `<b>${TITLE}</b>`

  s = `${s}\n<i>${SUBTITLE}</i>`

  let qs: string | undefined = undefined
  if (query) {
    qs = Object.entries(query).reduce((acc, [k, v]) => {
      if (acc) {
        return `${acc},${k}=${v}`
      } else {
        return `${k}=${v}`
      }
    }, '')
  }

  return qs
    ? `${route.method.toUpperCase()} ${route.path}?${qs}`
    : `${route.method.toUpperCase()} ${route.path}`
}

const details = (request: Hapi.Request, event: Hapi.RequestEvent) => {
  const request_id = (event as any).request || 'unknown request id'

  //   const { paramsArray, payload } = request

  const timestamp = event.timestamp

  const arr = [
    `Request ID:\n<code>${request_id}</code>`,
    `Timestamp:\n<code>${timestamp}</code> (${new Date(
      timestamp
    ).toUTCString()})`,
    `Tags:\n${event.tags.join(', ')}`
  ]

  const headers: string[] = []

  const cache_control = request.headers && request.headers['cache-control']
  if (cache_control) {
    headers.push(`Cache-Control: ${cache_control}`)
  }

  const host = request.headers && request.headers['host']
  if (host) {
    headers.push(`Host: ${host}`)
  }

  const user_agent = request.headers && request.headers['user-agent']
  if (user_agent) {
    headers.push(`User-Agent: ${user_agent}`)
  }

  if (headers.length > 0) {
    arr.push(`Request headers:\n<pre>${headers.join('\n\n')}</pre>`)
  }

  return arr
}
const anchorTags = (links: Link[]) => {
  return links.map((link) => `<a href="${link.href}">${link.text}</a>`)
}

export const teapot = (
  request: Hapi.Request,
  event: Hapi.RequestEvent,
  _tags: Tags
) => {
  let s = `<b>${TITLE}</b>`

  s = `${s}\n<i>${SUBTITLE}</i>`

  s = `${s}\n\n${Emoji.Teapot} <b>${summaryFromRequest(request)}</b>`

  s = `${s}\n\n${details(request, event).join('\n\n')}`

  const anchor_tags = anchorTags([
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418',
      text: `418 I'm a teapot - mdn.dev`
    },
    {
      href: 'https://stackoverflow.com/questions/52340027/is-418-im-a-teapot-really-an-http-response-code',
      text: `Is 418 "I'm a teapot" really an HTTP response code? - stackoverflow.com`
    }
  ])

  if (anchor_tags.length > 0) {
    s = `${s}\n\nLinks:\n${anchor_tags.join('\n')}`
  }

  s.slice(0, CHARACTER_LIMIT_TELEGRAM_MESSAGE)

  return s
}

export const unauthorized = (
  request: Hapi.Request,
  event: Hapi.RequestEvent,
  _tags: Tags
) => {
  let s = `<b>${TITLE}</b>`

  s = `${s}\n<i>${SUBTITLE}</i>`

  s = `${s}\n\n${Emoji.Warning} <b>${summaryFromRequest(request)}</b>`

  s = `${s}\n\n${details(request, event).join('\n\n')}`

  const anchor_tags = anchorTags([
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401',
      text: '401 Unauthorized on MDN Web Docs'
    }
  ])

  if (anchor_tags.length > 0) {
    s = `${s}\n\nLinks:\n${anchor_tags.join('\n')}`
  }

  s.slice(0, CHARACTER_LIMIT_TELEGRAM_MESSAGE)

  return s
}

export const serverError = (
  request: Hapi.Request,
  event: Hapi.RequestEvent,
  _tags: Tags
) => {
  let s = `<b>${TITLE}</b>`

  s = `${s}\n<i>${SUBTITLE}</i>`

  s = `${s}\n\n${Emoji.CrossMark} <b>${summaryFromRequest(request)}</b>`

  s = `${s}\n\n${details(request, event).join('\n\n')}`

  const anchor_tags = anchorTags([
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses',
      text: 'Server error responses on MDN Web Docs'
    },
    {
      href: 'https://cloud.google.com/run/docs/container-contract',
      text: 'Container runtime contract'
    }
  ])

  if (anchor_tags.length > 0) {
    s = `${s}\n\nLinks:\n${anchor_tags.join('\n')}`
  }

  s.slice(0, CHARACTER_LIMIT_TELEGRAM_MESSAGE)

  return s
}
