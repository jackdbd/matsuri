declare module 'blipp' {
  import type Hapi from '@hapi/hapi'

  export interface Options {
    showAuth: boolean
    showScope: boolean
    showStart: boolean
  }

  function register(
    server: Hapi.Server, // Hapi.ServerRegisterPluginObject<Options>,
    options?: Options // Hapi.ServerRegisterOptions
  ): any

  export default { register, pkg }
}
