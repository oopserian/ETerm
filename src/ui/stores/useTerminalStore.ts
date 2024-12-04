import { create } from "zustand";

export type Position = 'top' | 'left' | 'right' | 'bottom';
export interface TerminalData {
    id: string,
    name: string,
    host: HostData[],
    status: TerminalStatus,
}

export interface TerminalView {
    terminal: TerminalData,
    area: [number, number, number, number],
    childs: Record<string, TerminalView>
}

interface TerminalStore {
    views: Record<string, TerminalView>
    terminals: Record<string, TerminalData>
    curView: TerminalView | null
    setCurView: (id: string) => void
    addView: (view: TerminalView) => void
    splitView: (dragId: string, dropId: string, position: Position) => void
    updateTerminal: (id: string, terminal: Partial<TerminalData>) => void
    deleteTerminal: (id: string) => void
}

const useTerminalStore = create<TerminalStore>((set) => ({
    views: {},
    terminals: {},
    curView: null,
    setCurView: (id: string) => set((state) => ({
        curView: state.views[id]
    })),
    addView: (view) => set((state) => {
        let views = { ...state.views };
        views = {
            ...views,
            [view.terminal.id]: view
        };
        return { views }
    }),
    splitView: (dragId, dropId, position) => set((state) => {
        let views = { ...state.views };
        let dragView = views[dragId];
        let dropView = views[dropId];
        // 假设 dragView.area = [x, y, w, h]
        let [rs, cs, re, ce] = dragView.area;

        console.log(position);

        if (position === 'top') {
            dragView.area = [rs, cs, re / 2, ce]; 
            dropView.area = [rs + re / 2, cs, re, ce];  
        } else if (position === 'bottom') {
            dragView.area = [rs + re / 2, cs, re , ce]; 
            dropView.area = [rs, cs, re / 2, ce];  
        } else if (position === 'left') {
            dragView.area = [rs, cs, re, ce / 2];  
            dropView.area = [rs, cs + ce / 2, re, ce];
        } else if (position === 'right') {
            dragView.area = [rs, cs + ce / 2, re, ce]; 
            dropView.area = [rs, cs, re, ce / 2]; 
        }

        console.log(views)
        return {
            views
        };
    }),
    updateTerminal: (id, terminal) => set((state) => {
        let views = { ...state.views };
        views[id].terminal = {
            ...views[id].terminal,
            ...terminal
        };
        return {
            views
        };
    }),
    deleteTerminal: (id) => set((state) => {
        window.terminal.delete(id);
        const { [id]: _, ...remainingTerminals } = state.terminals; // 解构排除指定的 id
        return { terminals: remainingTerminals }; // 返回新的 termianls 对象
    })
}));


export default useTerminalStore