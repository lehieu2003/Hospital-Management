import { create } from 'zustand';

import * as signalR from '@microsoft/signalr';

interface SignalRState {
    connection: signalR.HubConnection | null;
    initSignalR: (token: string) => void;
}

const INITIAL_STATE: SignalRState = {
    connection: null,
    initSignalR: () => {},
};

const useSignalRStore = create<SignalRState>((set, state) => ({
    ...INITIAL_STATE,
    initSignalR: async (token: string) => {
        if (state().connection?.state === signalR.HubConnectionState.Connecting) {
            return;
        }
        console.log('initSignalR');
        if (state().connection) {
            state().connection!.stop();
        }
        set({
            connection: new signalR.HubConnectionBuilder()
                .withUrl('/api/realtime', {
                    transport: signalR.HttpTransportType.LongPolling,
                    accessTokenFactory() {
                        return token;
                    },
                })
                .withAutomaticReconnect()
                .build(),
        });

        await state().connection?.start();
        setInterval(() => {
            console.log(state().connection?.state);
        }, 10000);
    },
}));

export default useSignalRStore;
