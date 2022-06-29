import { register } from './register.js'

export type { Options } from './handlers.js'

export default {
  // dependencies,
  multiple: false,
  name: 'telegram',
  register,
  requirements: {
    hapi: '>=20.0.0'
    // node: '>=16.0.0'
  },
  version: '0.0.1'
}
