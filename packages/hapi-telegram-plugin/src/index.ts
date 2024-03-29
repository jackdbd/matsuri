import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { register } from './register.js'

export type {
  Options,
  RequestEventMatcher,
  TelegramChatId,
  TelegramToken
} from './interfaces.js'
export type { Tags } from '@jackdbd/hapi-request-event-predicates'

export {
  clientError,
  serverError,
  makeGcpCloudRunServiceErrorText
} from './texts/index.js'
export type { Config as CloudRunServiceErrorTextConfig } from './texts/cloud-run.js'

const json = readFileSync(join('.', 'package.json'), { encoding: 'utf-8' })
const pkg = JSON.parse(json)

export default {
  multiple: false,
  name: 'telegram',
  once: true,
  pkg,
  register,
  requirements: {
    hapi: '>=20.0.0'
  },
  version: pkg.version
}
