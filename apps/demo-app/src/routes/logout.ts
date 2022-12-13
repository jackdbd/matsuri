import type Hapi from '@hapi/hapi'

export const logout = (): Hapi.ServerRoute => {
  return {
    method: 'GET',
    handler: (request, h) => {
      request.cookieAuth.clear()

      return h.view('logout', {
        title: 'Logout'
      })
    },
    options: {
      auth: {
        strategy: 'session',
        mode: 'try'
      },
      description: 'Logout',
      notes: `When a user ends up on this route, its session cookie is cleared`,
      tags: ['auth', 'session', 'logout']
    },
    path: '/logout'
  }
}
