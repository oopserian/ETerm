import { create } from "zustand";

export type Position = 'top' | 'left' | 'right' | 'bottom';
export interface TerminalData {
    id: string,
    name: string,
    host: HostData[],
    status: TerminalStatus,
}

export interface TerminalTab {
    id: string,
    name: string,
    views?: Record<string, View>
}

export interface View {
    id: string,
    pView?: string,
    type?: 'x' | 'y',
    rate?: number,
    views?: [string, string]
}

interface TerminalStore {
    tabs: Record<string, TerminalTab>,
    curTabId: string,
    terminals: Record<string, TerminalData>,
    addTab: (terminal: TerminalData) => void,
    activeTab: (tabId: string) => void,
    updateTerminal: (id: string, terminal: Partial<TerminalData>) => void,
    splitView: (tabId: string, dragId: string, dropId: string, position: Position) => void
}

const useTerminalStore = create<TerminalStore>((set) => ({
    tabs: {},
    terminals: {},
    curTabId: '',
    activeTab: (tabId) => set({ curTabId: tabId }),
    addTab: (terminal) => set((state) => (
        {
            terminals: {
                ...state.terminals,
                [terminal.id]: terminal
            },
            tabs: {
                ...state.tabs,
                [terminal.id]: {
                    id: terminal.id,
                    name: terminal.name,
                }
            }
        }
    )),
    updateTerminal: (id, terminal) => set((state) => ({
        terminals: {
            ...state.terminals,
            [id]: {
                ...state.terminals[id],
                ...terminal
            }
        }
    })),
    splitView: (tabId, dragId, dropId, position) => set((state) => {
        let tabs = { ...state.tabs };
        delete tabs[dragId];
        let views = tabs[tabId].views || {};

        let splitType: View['type'] = (position == 'left' || position == 'right') ? 'x' : 'y';

        views = {
            ...views,
            ['split-1']: {
                id: 'split-1',
                type: splitType,
                rate: 0.5,
                views: [dragId, dropId]
            },
            [dragId]: {
                id: dragId,
                pView: 'split-1'
            },
            [dropId]: {
                id: dropId,
                pView: 'split-1'
            }
        };

        tabs[tabId] = {
            id: tabId,
            name: '多窗口',
            views
        };

        console.log(tabs);

        return { tabs }
    })
}));


export default useTerminalStore