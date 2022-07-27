import type { Request, ResponseToolkit } from '@hapi/hapi'
import Boom from '@hapi/boom'

export const brokenGet = (config: any) => {
  const { app_human_readable_name } = config

  const method = 'GET'
  const path = '/broken'

  return {
    method,
    path,
    handler: async (request: Request, _h: ResponseToolkit) => {
      request.log(['broken', 'handler'], {
        message: `${app_human_readable_name} got ${method} request at ${path}`
      })

      const qs = request.query

      switch (qs.error) {
        case 'internal': {
          throw Boom.internal()
        }
        case 'method-not-allowed': {
          throw Boom.methodNotAllowed('sorry, your request is not allowed')
        }
        case 'not-accetable': {
          throw Boom.notAcceptable()
        }
        case 'not-found': {
          throw Boom.notFound()
        }
        case 'not-implemented': {
          throw Boom.notImplemented()
        }
        default: {
          throw new Error(`this is route an internal error`)
        }
      }

      return { message: 'broken' }
    },
    options: {
      description: 'This is just a demo route that throws an exception',
      notes: `This demo route always throws an exception`,
      tags: ['broken']
    }
  }
}
