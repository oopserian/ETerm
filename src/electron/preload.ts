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

export const common = {
    decryptPassword: (password: string, iv: string) => ipcInvoke('decryptPassword', password, iv)
};

export const terminal = {
    input: (command: string) => ipcInvoke('terminalInput', command),
    output() {

    }
};

contextBridge.exposeInMainWorld('ssh', ssh);
contextBridge.exposeInMainWorld('common', common);
contextBridge.exposeInMainWorld('terminal', terminal);