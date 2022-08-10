import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'

export const testServer = async () => {
  const server = Hapi.server({
    // debug: { log: ['*'], request: ['*'] },
    port: 8080
  })

  server.route({
    method: 'GET',
    path: '/foo',
    handler: (request, h) => {
      // request.log(['debug', 'handler'], { message: 'GET /foo' })
      return { message: 'got foo' }
    }
  })

  server.route({
    method: 'GET',
    path: '/internal',
    handler: (request, h) => {
      // request.log(['error', 'handler'], { message: 'GET /internal' })
      throw Boom.internal()
    }
  })

  server.route({
    method: 'GET',
    path: '/unauthorized',
    handler: (request, h) => {
      // request.log(['error', 'handler'], { message: 'GET /unauthorized' })
      throw Boom.unauthorized()
    }
  })

  server.route({
    method: 'GET',
    path: '/not-found',
    handler: (request, h) => {
      //   request.log(['foo'], { message: 'GET /not-found' })
      if (request.query && request.query.foo === '123') {
        return { message: 'got foo' }
      }
      throw Boom.notFound()
    }
  })

  server.route({
    method: 'GET',
    path: '/not-implemented',
    handler: (request, h) => {
      // request.log(['error', 'handler'], { message: 'GET /not-implemented' })
      throw Boom.notImplemented()
    }
  })

  // https://github.com/hapijs/podium
  // https://github.com/hapijs/podium/blob/master/lib/index.js
  // Hapi.RequestEventHandler
  server.events.on('request', (_request, event, tag_dict) => {
    console.log('event', event)
    console.log('event.tags', event.tags)
    console.log('tag_dict', tag_dict)
  })

  return server
}

export const makeDispatch = ({ event, tags, predicate }) => {
  return function dispatch(req, res) {
    const b = predicate(req, event, tags)

    const reply = b ? 'PASSED' : 'FAILED'
    const status_code = b ? 200 : 400

    res.writeHead(status_code, {
      'Content-Type': 'text/plain',
      'Content-Length': reply.length
    })

    res.end(reply)
  }
}
