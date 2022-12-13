import Boom from '@hapi/boom';
export const errorGet = () => {
    const method = 'GET';
    const path = '/error';
    return {
        method,
        path,
        handler: async (request, _h) => {
            request.log(['error', 'handler'], {
                message: `got ${method} request at ${path}`
            });
            const qs = request.query;
            switch (qs.error) {
                case 'unauthorized': {
                    throw Boom.unauthorized();
                }
                case 'forbidden': {
                    throw Boom.forbidden();
                }
                case 'not-found': {
                    throw Boom.notFound();
                }
                case 'method-not-allowed': {
                    throw Boom.methodNotAllowed('sorry, your request is not allowed');
                }
                case 'not-accetable': {
                    throw Boom.notAcceptable();
                }
                case 'teapot': {
                    throw Boom.teapot();
                }
                case 'too-many-requests': {
                    throw Boom.tooManyRequests();
                }
                case 'internal': {
                    throw Boom.internal();
                }
                case 'not-implemented': {
                    throw Boom.notImplemented();
                }
                default: {
                    throw new Error(`this is route an internal error`);
                }
            }
        },
        options: {
            description: 'This is a route that throws an exception',
            notes: `This demo route always throws an exception`,
            tags: ['error', 'handler']
        }
    };
};
