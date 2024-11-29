import { create } from "zustand";

export interface TerminalData {
    id: string,
    host: HostData,
    status: TerminalStatus
}

interface TerminalStore {
    terminals: Record<string, TerminalData>
    curTerminal: TerminalData | null
    setCurTerminal: (id: string) => void
    addTerminals: (terminals: Record<string, TerminalData>) => void
    addTerminal: (terminal: TerminalData) => void
    updateTerminal: (id:string, terminal: Partial<TerminalData>) => void
    deleteTerminal: (id:string) => void
}

const useTerminalStore = create<TerminalStore>((set) => ({
    terminals: {},
    curTerminal: null,
    setCurTerminal: (id:string) => set((state)=>({
        curTerminal: state.terminals[id]
    })),
    addTerminals: (terminals) => set(() => ({
        terminals
    })),
    addTerminal: (terminal) => set((state) => ({
        terminals: {
            ...state.terminals,
            [terminal.id]: terminal
        }
    })),
    updateTerminal: (id, terminal) => set((state)=>{
         // 通过展开操作符创建一个新的终端对象
        const terminals = { ...state.terminals };

        if (terminals[id]) {
            terminals[id] = {
                ...terminals[id], // 保留现有的字段
                ...terminal, // 更新传入的部分数据
            };
        }

        return {
            terminals, // 返回更新后的新的 terminals 对象
        };
    }),
    deleteTerminal: (id) => set((state) => {
        window.terminal.delete(id);
        const { [id]: _, ...remainingTerminals } = state.terminals; // 解构排除指定的 id
        return { terminals: remainingTerminals }; // 返回新的 termianls 对象
    })
}));


export default useTerminalStore