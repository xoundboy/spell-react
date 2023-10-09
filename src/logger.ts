import { config } from './config';

export const log = (...args: any) => {
    if(config.LOGGING_ENABLED) {
        console.log(...args)
    }
}
