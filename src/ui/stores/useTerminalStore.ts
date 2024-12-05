import { create } from "zustand";

export type Position = 'top' | 'left' | 'right' | 'bottom';
export interface TerminalData {
    id: string,
    name: string,
    host: HostData[],
    status: TerminalStatus,
}

export interface TerminalView {
    id: string,
    name: string,
    views: Record<string, {
        area: [number, number, number, number]
    }>
}

interface TerminalStore {
    views: Record<string, TerminalView>
    terminals: Record<string, TerminalData>
    curView: TerminalView | null
    setCurView: (id: string) => void
    addView: (terminal: TerminalData) => void
    splitView: (viewId: string, dragId: string, dropId: string, position: Position) => void
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
    addView: (terminal) => set((state) => {
        let views = { ...state.views };
        let terminals = { ...state.terminals };
        terminals[terminal.id] = terminal;
        views = {
            ...views,
            [terminal.id]: {
                id: terminal.id,
                name: terminal.name,
                views: {
                    [terminal.id]: {
                        area: [0, 0, 10, 10]
                    }
                }
            }
        };
        return { views, terminals }
    }),
    splitView: (viewId, dragId, dropId, position) => set((state) => {
        let views = { ...state.views };
        let view = views[viewId];
        view.views[dragId] = { area: [0, 0, 0, 0] };
        delete views[dragId];
        view.name = 'split view';
        let dragView = view.views[dragId];
        let dropView = view.views[dropId];
        let [dp_y1, dp_x1, dp_y2, dp_x2] = dropView.area;

        // 计算中点
        const midY = Math.floor(dp_y1 + (dp_y2 - dp_y1) / 2);
        const midX = Math.floor(dp_x1 + (dp_x2 - dp_x1) / 2);

        // 处理分割
        if (position === 'top') {
            dragView.area = [dp_y1, dp_x1, midY, dp_x2];
            dropView.area = [midY, dp_x1, dp_y2, dp_x2];
        } else if (position === 'bottom') {
            dragView.area = [midY, dp_x1, dp_y2, dp_x2];
            dropView.area = [dp_y1, dp_x1, midY, dp_x2];
        } else if (position === 'left') {
            dragView.area = [dp_y1, dp_x1, dp_y2, midX];
            dropView.area = [dp_y1, midX, dp_y2, dp_x2];
        } else if (position === 'right') {
            dragView.area = [dp_y1, midX, dp_y2, dp_x2];
            dropView.area = [dp_y1, dp_x1, dp_y2, midX];
        }

        return {
            views
        };
    }),
    updateTerminal: (id, terminal) => set((state) => {
        let terminals = { ...state.terminals };
        terminals[id] = {
            ...terminals[id],
            ...terminal
        };
        return {
            terminals
        };
    }),
    deleteTerminal: (id) => set((state) => {
        window.terminal.delete(id);
        const { [id]: _, ...remainingTerminals } = state.terminals; // 解构排除指定的 id
        return { terminals: remainingTerminals }; // 返回新的 termianls 对象
    })
}));


export default useTerminalStore