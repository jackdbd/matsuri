import type Hapi from '@hapi/hapi'

export const homeGet = (): Hapi.ServerRoute => {
  return {
    handler: async (request, h: any) => {
      request.log(['debug', 'handler', 'home', 'index'], {
        message: `got ${request.method} request at ${request.path}`
      })

      return h
        .view('index', {
          title: 'Matsuri demo app',
          description: 'This is the home page of the demo app',
          message: `Running Hapi.js ${request.server.version}`
        })
        .code(200)
    },
    method: 'GET',
    options: {
      auth: false,
      description: 'This route is for the home page',
      notes: `This route is for the home page of the web app`,
      tags: ['home', 'index']
    },
    path: '/'
  }
}
