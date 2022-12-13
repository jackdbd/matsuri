import Exiting from 'exiting';
import { app } from './app.js';
export const provision = async () => {
    const { server } = await app();
    const manager = Exiting.createManager([server], { exitTimeout: 10000 });
    await manager.start();
};
