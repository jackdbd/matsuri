import { readFileSync } from 'node:fs'
import { join } from 'node:path'
export type { Tags } from '@jackdbd/hapi-request-event-predicates'
export type {
  Options,
  RequestEventMatcher,
  GitHubIssue,
  GiHubToken
} from './interfaces.js'
import { register } from './register.js'

const json = readFileSync(join('.', 'package.json'), { encoding: 'utf-8' })
const pkg = JSON.parse(json)

export default {
  multiple: false,
  name: 'github-issue',
  once: true,
  pkg,
  register,
  requirements: {
    hapi: '>=20.0.0'
  },
  version: pkg.version
}
