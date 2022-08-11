import type Hapi from '@hapi/hapi'
import { makeLog } from '@jackdbd/tags-logger'
import { SEVERITY_TAG_VALUES } from './constants.js'

interface Config {
  namespace?: string
  should_use_emoji_for_severity: boolean
  should_validate_log_statements: boolean
}

interface LogEventData {
  message: string
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
    const { channel, timestamp } = event

    let message = 'NO event.data (log event)'
    if (event.data) {
      message = (event.data as LogEventData).message || 'NO event.data.message'
    }

    log({
      message,
      tags: tagsWithSeverityTag(event),
      timestamp,
      channel
    } as any)
  }
}

/**
 * @internal
 */
export const makeOnRequest = ({
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
    const { channel, timestamp } = event

    // If event.data has no message and tags-logger is configured to validate
    // each log statement, tags-logger will throw an exception (so no need to
    // validate anything here).
    const request_id = (event as any).request as string

    // request events that have a `channel` of `internal` or `error` do not have
    // `event.data`. I'm not sure whether I should log these events or not.
    // https://github.com/hapijs/podium/tree/master

    let message = 'NO event.data (request event)'
    if (event.data) {
      message =
        (event.data as RequestEventData).message || 'NO event.data.message'
    }

    // I think that in order to avoid `any` tags-logger would need to use a
    // generic like <T extends Statement>
    // https://stackoverflow.com/questions/66563466/allow-passing-a-function-with-extended-interface-as-parameter-in-react-typescr
    log({
      message,
      tags: tagsWithSeverityTag(event),
      timestamp,
      channel,
      request_id
    } as any)
  }
}
