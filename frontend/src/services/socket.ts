/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-constructor */
import Echo from 'laravel-echo';
import Pusher, { Options } from 'pusher-js';

class EchoSingleton {
    private static instance: Echo;

    private static geralConfig: Options = {
        disableStats: true,
        forceTLS: false,
        wsHost: 'localhost',
        wsPort: 6001,
    };

    private static echoConfig = {
        broadcaster: 'pusher',
        key: 'app-key',
        encrypted: true,
        enabledTransports: ['ws'],
    };

    private constructor() {}

    public static getInstance(): Echo {
        if (!EchoSingleton.instance) {
            EchoSingleton.instance = new Echo({
                ...EchoSingleton.geralConfig,
                ...EchoSingleton.echoConfig,
                client: new Pusher(
                    EchoSingleton.echoConfig.key,
                    EchoSingleton.geralConfig,
                ),
            });
        }

        return EchoSingleton.instance;
    }
}

/**
 * Get an Echo instance
 * @returns The Echo instance
 */
export function getEcho(): Echo {
    return EchoSingleton.getInstance();
}
