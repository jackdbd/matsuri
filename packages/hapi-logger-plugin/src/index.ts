import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { register } from './register.js'

export type { Options } from './schemas.js'

const json = readFileSync(join('.', 'package.json'), { encoding: 'utf-8' })
const pkg = JSON.parse(json)

export default {
  multiple: false,
  name: 'logger',
  once: true,
  pkg,
  register,
  requirements: {
    hapi: '>=20.0.0'
  },
  version: pkg.version
}
