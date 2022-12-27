export const authGitHub = () => {
    return {
        method: ['GET', 'POST'],
        handler: (request, h) => {
            if (request.auth.isAuthenticated) {
                const profile = request.auth.credentials.profile;
                const context = {
                    name: profile.displayName,
                    username: profile.username,
                    provider: 'GitHub',
                    avatar: profile.raw.avatar_url,
                    title: 'User authenticated',
                    description: 'The user is authenticated and can use the demo app'
                };
                const session = {
                    github_id: profile.id,
                    github_username: profile.username
                };
                request.cookieAuth.set(session);
                return h.view('authenticated', context);
            }
            else {
                const details = [
                    'The user is not authenticated',
                    'There was an issue with the GitHub authentication'
                ];
                if (request.auth.error && request.auth.error.message) {
                    details.push(request.auth.error.message);
                }
                request.log(['error', 'auth', 'github'], {
                    message: `authentication with GitHub failed`,
                    details
                });
                return h
                    .view('index', {
                    title: 'User unauthenticated',
                    description: details.join('. ')
                })
                    .code(400);
            }
        },
        options: {
            auth: {
                strategy: 'github',
                mode: 'try'
            },
            description: 'Login with GitHub',
            notes: `When a user ends up on this route, Bell tries to authenticate him using the github provider`,
            tags: ['auth', 'github']
        },
        path: '/auth/github'
    };
};
