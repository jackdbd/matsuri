import type Hapi from '@hapi/hapi'
import type { Tags } from '@jackdbd/hapi-request-event-predicates'
import {
  gcpCloudRunServiceText as serviceText,
  gcpCloudRunServiceErrorText as errorText
} from '@jackdbd/telegram-text-messages'
import { Emoji } from '../constants.js'
import { clientError } from './client-error.js'
import { serverError } from './server-error.js'
import { summaryFromRequest } from './utils.js'

export interface Config {
  gcp_project_id: string
  cloud_run_service_region_id: string
}

export const makeGcpCloudRunServiceErrorText = ({
  gcp_project_id,
  cloud_run_service_region_id
}: Config) => {
  return function gcpCloudRunServiceErrorText(
    request: Hapi.Request,
    event: Hapi.RequestEvent,
    tags: Tags
  ) {
    // this doesn't seem to work...
    let statusCode = undefined as number | undefined
    if (request.response) {
      const res = request.response as Hapi.ResponseObject
      if (res.statusCode) {
        statusCode = res.statusCode
      }
    }

    if (event.error) {
      const isServer = (event.error as any).isServer

      const text = isServer
        ? serverError(request, event, tags)
        : clientError(request, event, tags)

      const title = isServer
        ? `${Emoji.CrossMark} Server error ${statusCode || '5xx'}`
        : `${Emoji.Warning} Client error ${statusCode || '4xx'}`

      return serviceText({
        title,
        gcp_project_id,
        cloud_run_service_region_id,
        description: text
        // sections: [{ title: 'Telegram', body: 'this is the body' }]
      })
    } else {
      const error_message = `Request event contained no error, when instead it was supposed to have one`

      const title = statusCode
        ? `${Emoji.CrossMark} ${summaryFromRequest(request)} ${statusCode}`
        : `${Emoji.CrossMark} ${summaryFromRequest(request)}`

      return errorText(
        {
          cloud_run_service_region_id,
          error: new Error(error_message),
          gcp_project_id,
          title
        },
        { should_include_stack_trace: false }
      )
    }
  }
}
