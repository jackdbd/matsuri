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
        case 'unauthorized': {
          // 401
          throw Boom.unauthorized()
        }

        case 'forbidden': {
          // 403
          throw Boom.forbidden()
        }

        case 'not-found': {
          // 404
          throw Boom.notFound()
        }

        case 'method-not-allowed': {
          // 405
          throw Boom.methodNotAllowed('sorry, your request is not allowed')
        }

        case 'not-accetable': {
          // 406
          throw Boom.notAcceptable()
        }

        case 'teapot': {
          // 418
          throw Boom.teapot()
        }

        case 'too-many-requests': {
          // 429
          throw Boom.tooManyRequests()
        }

        case 'internal': {
          // 500
          throw Boom.internal()
        }

        case 'not-implemented': {
          // 501
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
