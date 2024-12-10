import { create } from "zustand";
import { closeTerminals } from "@/hooks/useTerminal";
import { createSplitView } from "@/helpers/splitViewHelpers";

export type Position = 'top' | 'left' | 'right' | 'bottom';
export interface TerminalData {
    id: string,
    name: string,
    host: HostData,
    status: TerminalStatus,
    term?: any
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
    curFocusTerm: string,
    terminals: Record<string, TerminalData>,
    addTab: (terminal: TerminalData) => void,
    activeTab: (tabId: string) => void,
    updateTerminal: (id: string, terminal: Partial<TerminalData>) => void,
    splitView: (tabId: string, dragId: string, dropId: string, position: Position) => void,
    deleteView: (tabId: string) => void,
    setCurFocusTerm: (id: string) => void
}

const useTerminalStore = create<TerminalStore>((set, get) => ({
    tabs: {},
    terminals: {},
    curTabId: '',
    curFocusTerm: '',
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
                ...(state.terminals[id] || {}),
                ...terminal
            }
        }
    })),
    deleteView: (tabId) => set((state) => {
        let tabs = { ...state.tabs };
        let views = tabs[tabId].views;
        let terminalIds: string[] = [];
        if (views) {
            terminalIds = Object.values(views).filter(view => !view.type).map(view => view.id);
        } else {
            terminalIds = [tabs[tabId].id];
        };
        closeTerminals(terminalIds);
        delete tabs[tabId];
        return ({
            tabs
        })
    }),
    splitView: (tabId, dragId, dropId, position) => set((state) => {
        const tabs = { ...state.tabs };
        const currentTab = tabs[tabId];
        const id = Date.now().toString();

        if (currentTab.views) {
            const views = { ...currentTab.views };
            const parentViewId = views[dropId].pView!;
            let newViews = createSplitView({ id, views, parentViewId, dragId, dropId, position });
            tabs[tabId].views = newViews;
        } else {
            const newTabId = `group-tab-${id}`;
            let newViews = createSplitView({ id, dragId, dropId, position });
            tabs[newTabId] = {
                id: newTabId,
                name: '多窗口',
                views: newViews,
            };
            delete tabs[tabId];
            get().activeTab(newTabId);
        };
        delete tabs[dragId];
        return { tabs };
    }),
    setCurFocusTerm: (id) => set({ curFocusTerm: id })
}));


export default useTerminalStore