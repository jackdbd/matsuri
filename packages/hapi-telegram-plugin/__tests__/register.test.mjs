import { register } from '../lib/register.js'
import { serverError } from '../lib/texts/index.js'
import { makeHapiServer } from '../../../scripts/utils.mjs'

describe('register', () => {
  let server
  const timeout_ms = 10000
  const TELEGRAM_CHAT_ID_original = process.env.TELEGRAM_CHAT_ID
  const TELEGRAM_BOT_TOKEN_original = process.env.TELEGRAM_BOT_TOKEN

  beforeAll(() => {
    server = makeHapiServer()
  })

  beforeEach(async () => {
    await server.start()
  }, timeout_ms)

  afterEach(async () => {
    await server.stop()
    process.env.TELEGRAM_CHAT_ID = TELEGRAM_CHAT_ID_original
    process.env.TELEGRAM_BOT_TOKEN = TELEGRAM_BOT_TOKEN_original
  }, timeout_ms)

  it('cannot be registered if no options are passed, AND the TELEGRAM_CHAT_ID environment variable is not set', () => {
    delete process.env.TELEGRAM_CHAT_ID
    expect(() => {
      register(server)
    }).toThrowError('TELEGRAM_CHAT_ID')
  })

  it('cannot be registered if no options are passed, AND the TELEGRAM_BOT_TOKEN environment variable is not set', () => {
    process.env.TELEGRAM_CHAT_ID = 'my-chat-id'
    delete process.env.TELEGRAM_BOT_TOKEN

    expect(() => {
      register(server)
    }).toThrowError('TELEGRAM_BOT_TOKEN')
  })

  it('can be registered if no options are passed, BUT both the TELEGRAM_CHAT_ID and the TELEGRAM_BOT_TOKEN environment variables are set', () => {
    process.env.TELEGRAM_CHAT_ID = 'my-chat-id'
    process.env.TELEGRAM_BOT_TOKEN = 'my-bot-token'

    register(server)

    // if we are here, we register the plugin
    expect(true).toBeTruthy()
  })

  it('can be registered if neither TELEGRAM_CHAT_ID and TELEGRAM_BOT_TOKEN environment variables are set, but options are passed', () => {
    delete process.env.TELEGRAM_CHAT_ID
    delete process.env.TELEGRAM_BOT_TOKEN

    const request_event_matchers = [
      {
        name: 'notify of server errors',
        chat_id: 'my-chat-id',
        token: 'my-bot-token',
        predicate: (request, event, tags) => true,
        text: serverError
      }
    ]

    const options = { request_event_matchers }

    register(server, options)

    // if we are here, we register the plugin
    expect(true).toBeTruthy()
  })
})
