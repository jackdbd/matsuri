import type Hapi from '@hapi/hapi'
import Hoek from '@hapi/hoek'
import { isServerRequestError } from '@jackdbd/hapi-request-event-predicates'
import { TAG } from './constants.js'
import { options as schema } from './schemas.js'
import { makeHandleRequest } from './handlers.js'
import type { Options, RequestEventMatcher } from './interfaces.js'
import { defaultTitleFunction, defaultBodyFunction } from './texts.js'

/**
 * Retrieves the GitHub access token from the environment.
 *
 * @see [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
 */
const githubTokenFromEnvironment = () => {
  if (process.env.GH_TOKEN) {
    console.log(`using GH_TOKEN: ${process.env.GH_TOKEN}`)
    return process.env.GH_TOKEN
  }

  if (process.env.GITHUB_TOKEN) {
    console.log(`using GITHUB_TOKEN: ${process.env.GITHUB_TOKEN}`)
    return process.env.GITHUB_TOKEN
  }

  throw new Error(`neither GH_TOKEN nor GITHUB_TOKEN set in environment`)
}

const defaultRequestEventMatchers = (): RequestEventMatcher[] => {
  return [
    {
      title: defaultTitleFunction,
      predicate: isServerRequestError,
      body: defaultBodyFunction,
      // assignees: [],
      // milestone: undefined,
      labels: ['bug']
    }
  ]
}

/**
 * Registers the plugin with a Hapi server.
 *
 * @public
 */
export const register = (server: Hapi.Server, options?: Options) => {
  // consider using Hoek.merge() or Hoek.applyToDefaults()
  // https://hapi.dev/module/hoek/api/?v=10.0.0#mergetarget-source-options
  // https://hapi.dev/module/hoek/api/?v=10.0.0#applytodefaultsdefaults-source-options
  let config: Required<Options>
  const owner = 'jackdbd' // TODO
  const repo = 'matsuri' // TODO
  if (options) {
    const token = options.token || githubTokenFromEnvironment()
    if (options.request_event_matchers) {
      config = {
        ...options,
        owner,
        repo,
        request_event_matchers: options.request_event_matchers,
        token
      }
    } else {
      config = {
        ...options,
        owner,
        repo,
        request_event_matchers: defaultRequestEventMatchers(),
        token
      }
    }
  } else {
    config = {
      owner,
      repo,
      request_event_matchers: defaultRequestEventMatchers(),
      token: githubTokenFromEnvironment()
    }
  }

  const result = schema.validate(config, {
    allowUnknown: true,
    stripUnknown: true
  })
  Hoek.assert(!result.error, result.error && result.error.annotate())

  const handleRequest = makeHandleRequest({ ...config, server })

  server.events.on('request', handleRequest)

  server.log(['lifecycle', 'plugin', TAG], {
    message: `Hapi server registered the plugin ${TAG}.`
  })
}
