import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TicketDTO } from '@/types';

interface TicketState {
    currentTicket?: TicketDTO;
    setCurrentTicket: (ticket?: TicketDTO) => void;
    clearCurrentTicket: () => void;
}

const INITIAL_STATE: TicketState = {
    currentTicket: undefined,
    setCurrentTicket: () => {},
    clearCurrentTicket: () => {},
};

const useTicketStore = create<TicketState>()(
    devtools(
        persist<TicketState>(
            (set) => ({
                ...INITIAL_STATE,
                setCurrentTicket: (currentTicket) => set({ currentTicket }),
                clearCurrentTicket: () => set({ currentTicket: undefined }),
            }),
            { name: 'ticket-store' }
        )
    )
);

export default useTicketStore;
