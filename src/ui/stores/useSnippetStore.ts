import { create } from "zustand";

interface SnippetStore {
    snippets: Record<string, CommandSnippetData>,
    getSnippets: () => void
}

export const useSnippetStore = create<SnippetStore>((set) => ({
    snippets: {},
    getSnippets: async () => {
        const data = await window.commandSnippet.get();
        set({ snippets: data });
    }
}));