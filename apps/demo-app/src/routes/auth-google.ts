import type Hapi from '@hapi/hapi'
// import type { Session } from '../interfaces.js'

export const authGoogle = (): Hapi.ServerRoute => {
  return {
    method: ['GET', 'POST'],
    handler: (request: any, h: any) => {
      if (request.auth.isAuthenticated) {
        // The 3rd-party credentials are stored in request.auth.credentials.
        const profile = request.auth.credentials.profile as any

        // const locale = profile.raw.locale

        const context = {
          name: profile.displayName,
          provider: 'Google',
          username: profile.name.given_name,
          avatar: profile.raw.picture,
          title: 'User authenticated',
          description: 'The user is authenticated and can use the demo app'
        }

        // set the session cookie
        // const session: Session = {
        //   google_id: profile.id,
        // }
        request.cookieAuth.set({ google_id: profile.id })

        return h.view('authenticated', context)
        // return h.redirect('/')
      } else {
        console.log(
          '=== request.auth.credentials ===',
          request.auth.credentials
        )
        return h
          .view('index', {
            title: 'User unauthenticated',
            description:
              'The user is not authenticated. There was an issue with the Google authentication.'
          })
          .code(400)
      }
    },
    options: {
      auth: {
        strategy: 'google',
        mode: 'try'
      },
      description: 'Login with Google',
      notes: `When a user ends up on this route, Bell tries to authenticate him using the google provider`,
      tags: ['auth', 'google']
    },
    path: '/auth/google'
  }
}
