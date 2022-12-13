import Hoek from '@hapi/hoek';
export const protectedGet = () => {
    return {
        method: 'GET',
        handler: (request, h) => {
            Hoek.assert(request.auth.isAuthenticated, 'only authenticated requests should reach this handler');
            const username = request.auth.credentials.github_username;
            return h.view('index', {
                title: 'Protected route',
                description: 'This is a protected route',
                message: `you can access this route because you authenticated with GitHub as ${username}`
            });
        },
        options: {
            auth: {
                strategy: 'session',
                mode: 'required'
            },
            description: 'Authenticate with Github first, then you can access this route',
            notes: `To access this route the auth cookie must contain a valid session id`,
            tags: ['auth', 'session']
        },
        path: '/protected'
    };
};
