import { contextBridge, ipcRenderer } from "electron";
const ipcInvoke = <Key extends keyof EventPayloadMapping>(
    key: Key,
    ...args: EventPayloadMapping[Key]['params']
): Promise<EventPayloadMapping[Key]['result']> => {
    return ipcRenderer.invoke(key, ...args);
};

export const ssh = {
    get: () => ipcInvoke('getSSHData'),
    save: (data: sshData) => ipcInvoke('saveSSHData', data)
};

contextBridge.exposeInMainWorld('ssh', ssh);