import { create } from "zustand";

interface HostStore {
    hosts: Record<string, hostData>,
    setHosts: (hosts: Record<string, hostData>) => void
    getHosts: () => void
}

const useHostStore = create<HostStore>((set) => ({
    hosts: {},
    setHosts: (hosts) => set(() => ({ hosts })),
    getHosts: async () => {
        let res = await window.host.get();
        set(() => ({
            hosts: res
        }));
    }
}))


export default useHostStore