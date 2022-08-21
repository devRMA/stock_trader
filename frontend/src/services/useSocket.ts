import { useEffect, useRef } from 'react';

import { getEcho } from './socket';

/**
 * Listen to a new public event on websocket
 * @param channel The websocket channel
 * @param event The event to listen
 * @param callback The function to be called when the event is received
 */
export function usePublicSocket<TPayload>(
    channel: string,
    event: string,
    callback: (payload: TPayload) => void,
) {
    const savedCallback = useRef<(payload: TPayload) => void>(() => {});

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        if (event !== '' && channel !== '') {
            const echoChannel = getEcho().channel(channel);

            echoChannel.listen(event, savedCallback.current);

            return () => echoChannel.stopListening(event);
        }

        return () => {};
    }, [channel, event]);
}
