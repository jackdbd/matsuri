import type { LogEvent } from '@hapi/hapi'
import type { Dictionary } from '@jackdbd/utils/logger'

export interface ServerEvent extends LogEvent {
  data: { message?: string }
}

export interface RequestEvent extends LogEvent {
  data: { message?: string }
}

export interface RequestErrorEvent extends LogEvent {
  data: { message?: string }
  error: {
    data?: Dictionary
    message: string
    output: { statusCode: number }
  }
}

export interface Options {
  namespace: string
}
