import type Hapi from '@hapi/hapi'
import { makeLog } from '@jackdbd/tags-logger'
import { SEVERITY_TAG_VALUES } from './constants.js'

interface Config {
  channels: string[]
  namespace?: string
  should_use_emoji_for_severity: boolean
  should_validate_log_statements: boolean
}

interface LogEventData {
  message?: string
  [k: string]: any
}

interface RequestEventData {
  message: string
}

const DEFAULT_SEVERITY = 'debug'

/**
 * Adds a default severity tag to the log/request event, but only if necessary.
 *
 * It's not just our Hapi app that can emit log events and request events:
 * some plugins might call server.log() and request.log() without passing the
 * severity tag (i.e. 'debug', 'info', etc).
 * Unfortunately, both the events emitted by our app and the ones emitted by a
 * plugin are indistinguishable (they have both `app` as the podium `channel`).
 *
 * Since each log statement must include a severity tag when log statement
 * validation is enabled, not having such tag would make the validation fail.
 *
 * @internal
 */
const tagsWithSeverityTag = (event: Hapi.LogEvent | Hapi.RequestEvent) => {
  const severities = event.tags.filter((t) => SEVERITY_TAG_VALUES.includes(t))

  return severities.length === 0
    ? [...event.tags, DEFAULT_SEVERITY]
    : event.tags
}

/**
 * @internal
 */
export const makeOnLog = ({
  channels,
  namespace,
  should_use_emoji_for_severity,
  should_validate_log_statements
}: Config): Hapi.LogEventHandler => {
  const log = makeLog({
    namespace,
    should_use_emoji_for_severity,
    should_validate_log_statements
  })

  return function onLog(event, _tags) {
    if (!channels.includes(event.channel)) {
      return
    }
    const { channel, timestamp } = event

    let message = 'NO event.data (log event)'
    let additional_data = {} as { [k: string]: any }

    if (event.data) {
      const { message: msg, ...rest } = event.data as LogEventData
      message = msg || 'NO event.data.message'
      additional_data = rest
    }

    log({
      message,
      tags: tagsWithSeverityTag(event),
      timestamp,
      channel,
      ...additional_data
    })
  }
}

/**
 * @internal
 */
export const makeOnRequest = ({
  channels,
  namespace,
  should_use_emoji_for_severity,
  should_validate_log_statements
}: Config): Hapi.RequestEventHandler => {
  const log = makeLog({
    namespace,
    should_use_emoji_for_severity,
    should_validate_log_statements
  })

  return function onRequest(_request, event, _tags) {
    if (!channels.includes(event.channel)) {
      return
    }
    const { channel, timestamp } = event

    // If event.data has no message and tags-logger is configured to validate
    // each log statement, tags-logger will throw an exception (so no need to
    // validate anything here).
    const request_id = (event as any).request as string

    // request events that have a `channel` of `internal` or `error` do not have
    // `event.data`. I'm not sure whether I should log these events or not.
    // https://github.com/hapijs/podium/tree/master

    let data: object
    if (typeof event.data === 'string') {
      data = JSON.parse(event.data) as object
    } else {
      data = event.data
    }

    const message =
      (data as RequestEventData).message || 'NO event.data.message'

    // https://stackoverflow.com/questions/66563466/allow-passing-a-function-with-extended-interface-as-parameter-in-react-typescr
    log({
      ...data,
      message,
      tags: tagsWithSeverityTag(event),
      timestamp,
      channel,
      request_id
    })
  }
}
