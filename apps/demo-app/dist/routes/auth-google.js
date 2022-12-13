export const authGoogle = () => {
    return {
        method: ['GET', 'POST'],
        handler: (request, h) => {
            if (request.auth.isAuthenticated) {
                const profile = request.auth.credentials.profile;
                const context = {
                    name: profile.displayName,
                    provider: 'Google',
                    username: profile.name.given_name,
                    avatar: profile.raw.picture,
                    title: 'User authenticated',
                    description: 'The user is authenticated and can use the demo app'
                };
                request.cookieAuth.set({ google_id: profile.id });
                return h.view('authenticated', context);
            }
            else {
                console.log('=== request.auth.credentials ===', request.auth.credentials);
                return h
                    .view('index', {
                    title: 'User unauthenticated',
                    description: 'The user is not authenticated. There was an issue with the Google authentication.'
                })
                    .code(400);
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
    };
};
