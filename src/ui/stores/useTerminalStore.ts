import { create } from "zustand";

export interface TerminalData {
    id: string,
    host: HostData,
    status: TerminalStatus
}

interface TerminalStore {
    terminals: Record<string, TerminalData>
    setTerminals: (terminals: Record<string, TerminalData>) => void
    setTerminal: (terminal: TerminalData) => void
    updateTerminal: (id:string, terminal: Partial<TerminalData>) => void
}

const useTerminalStore = create<TerminalStore>((set) => ({
    terminals: {},
    setTerminals: (terminals: Record<string, TerminalData>) => set(() => ({
        terminals
    })),
    setTerminal: (terminal) => set((state) => ({
        terminals: {
            ...state.terminals,
            [terminal.id]: terminal
        }
    })),
    updateTerminal: (id, terminal) => set((state)=>({
        terminals:{
            ...state.terminals,
            [id]:{
                ...state.terminals[id],
                ...terminal
            }
        }
    }))
}));


export default useTerminalStore