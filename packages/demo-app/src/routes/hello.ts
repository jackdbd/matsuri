import type { Request, ResponseToolkit } from '@hapi/hapi'

export const helloGet = (config: any) => {
  const { app_human_readable_name } = config

  const method = 'GET'
  const path = '/hello'

  return {
    method,
    path,
    handler: async (request: Request, _h: ResponseToolkit) => {
      request.log(['debug', 'handler', 'hello'], {
        message: `${app_human_readable_name} got ${method} request at ${path}`
      })

      return { message: 'hello' }
    },
    options: {
      description: 'This is just a demo route',
      notes: `This demo route does nothing interesting`,
      tags: ['hello']
    }
  }
}
