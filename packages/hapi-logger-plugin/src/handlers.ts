import makeDebug from 'debug'
import type Hapi from '@hapi/hapi'
import { logDebug, logInfo, logWarning, logError } from '@jackdbd/utils/logger'
import { isErrorRequest, shouldLogEvent } from './predicates.js'
import { serverEventData, requestEventData, requestErrorData } from './utils.js'

export interface MakeLogEventHandlersConfig {
  isOnGCP: boolean
  namespace: string
  request_tags: string[]
  server_tags: string[]
}

export const makeEventHandlers = ({
  isOnGCP,
  namespace,
  request_tags,
  server_tags
}: MakeLogEventHandlersConfig) => {
  const debug = makeDebug(namespace)

  //
  const onLog: Hapi.LogEventHandler = (event, _tags) => {
    if (shouldLogEvent({ event, tags: server_tags })) {
      if (isOnGCP) {
        if (event.tags.includes('error')) {
          logError(serverEventData(event))
        } else if (event.tags.includes('lifecycle')) {
          logInfo(serverEventData(event))
        } else {
          logDebug(serverEventData(event))
        }
      } else {
        debug(`%O`, serverEventData(event))
      }
    }
  }

  const onRequest: Hapi.RequestEventHandler = (_request, event, tags) => {
    if (shouldLogEvent({ event, tags: request_tags })) {
      if (isOnGCP) {
        if (isErrorRequest(event, tags)) {
          logError(requestErrorData(event))
        } else if (event.tags.includes('warning')) {
          logWarning(requestEventData(event))
        } else {
          logDebug(requestEventData(event))
        }
      } else {
        if (isErrorRequest(event, tags)) {
          debug(`%O`, requestErrorData(event))
        } else {
          debug(`%O`, requestEventData(event))
        }
      }
    }
  }

  return { onLog, onRequest }
}
