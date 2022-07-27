import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'
import plugin from '../lib/index.js'

export const namespace = 'hapi-logger-plugin-test-app'

export const testServer = async () => {
  const server = Hapi.server({ port: 8080 })

  await server.register({
    plugin,
    options: {
      namespace
    }
  })
  server.log(['plugin', 'test'], {
    message: 'registered plugin hapi-logger-plugin'
  })

  server.route({
    method: 'GET',
    path: '/foo',
    handler: (request, h) => {
      request.log(['foo', 'handler', 'test'], { message: 'GET /foo' })
      return { message: 'got foo' }
    }
  })
  server.log(['route', 'test'], {
    message: 'registered route GET /foo'
  })

  server.route({
    method: 'GET',
    path: '/bar',
    handler: (request, h) => {
      request.log(['bar', 'handler', 'test'], { message: 'GET /bar' })
      return { message: 'got bar' }
    }
  })
  server.log(['route', 'test'], {
    message: 'registered route GET /bar'
  })

  server.route({
    method: 'GET',
    path: '/internal-error',
    handler: (request, h) => {
      request.log(['error', 'handler', 'internal-error', 'test'], {
        message: 'GET /internal-error'
      })
      throw new Error(
        'this is not the message you will see in the HTTP response'
      )
    }
  })
  server.log(['route', 'test'], {
    message: 'registered route GET /internal-error'
  })

  server.route({
    method: 'GET',
    path: '/private',
    handler: (request, h) => {
      request.log(['error', 'handler', 'private', 'test'], {
        message: 'GET /private'
      })
      throw Boom.unauthorized()
    }
  })
  server.log(['route', 'test'], {
    message: 'registered route GET /private'
  })

  return server
}
