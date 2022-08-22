import type Hapi from '@hapi/hapi'
import { TAG } from './constants.js'
import { makeHealthCheckHandler } from './handlers.js'

export interface Config {
  isHealthy: () => Promise<boolean>
  path: string
  message_healthy: string
  message_unhealthy: string
}

export const healthcheckRoute = ({
  isHealthy,
  path,
  message_healthy,
  message_unhealthy
}: Config): Hapi.ServerRoute => {
  return {
    handler: makeHealthCheckHandler({
      isHealthy,
      message_healthy,
      message_unhealthy
    }),

    method: 'GET',

    options: {
      auth: false,
      description: 'Check whether the server is healthy or not',
      notes: 'Healthcheck that checks whether the server is healthy or not',
      tags: ['api', TAG]
    },

    path
  }
}
