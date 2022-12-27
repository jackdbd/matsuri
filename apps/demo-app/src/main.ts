import Exiting from 'exiting'
import { app } from './app.js'

/**
 * Provisions a Hapi.Server for the current environment.
 */
export const provision = async () => {
  const { server } = await app()

  // https://github.com/kanongil/exiting
  const manager = Exiting.createManager([server], { exitTimeout: 10000 })

  await manager.start()
}

provision()
