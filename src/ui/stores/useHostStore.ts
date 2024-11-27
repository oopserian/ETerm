import { create } from "zustand";

interface HostStore {
    hosts: Record<string, sshData>,
    setHosts: (hosts: Record<string, sshData>) => void
    getHosts: () => void
}

const useHostStore = create<HostStore>((set) => ({
    hosts: {},
    setHosts: (hosts) => set(() => ({ hosts })),
    getHosts: async () => {
        let res = await window.ssh.get();
        set(() => ({
            hosts: res
        }));
    }
}))


export default useHostStore