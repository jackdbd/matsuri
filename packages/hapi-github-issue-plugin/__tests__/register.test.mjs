import { register } from '../lib/register.js'
import { makeHapiServer } from '../../../scripts/utils.mjs'

describe('register', () => {
  let server
  const timeout_ms = 10000
  const GH_TOKEN_original = process.env.GH_TOKEN
  const GITHUB_TOKEN_original = process.env.GITHUB_TOKEN

  beforeAll(() => {
    server = makeHapiServer()
  })

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
    process.env.GH_TOKEN = GH_TOKEN_original
    process.env.GITHUB_TOKEN = GITHUB_TOKEN_original
  }, timeout_ms)

  it('cannot be registered if no options are passed, AND neither GH_TOKEN or GITHUB_TOKEN environment variables are set', () => {
    delete process.env.GH_TOKEN
    delete process.env.GITHUB_TOKEN
    expect(() => {
      register(server)
    }).toThrowError('GITHUB_TOKEN')
  })

  it('can be registered if no options are passed, BUT the GITHUB_TOKEN environment variable is set', () => {
    process.env.GITHUB_TOKEN = 'my-github-token'

    register(server)

    // if we are here, we have managed to register the plugin
    expect(true).toBeTruthy()
  })
})
