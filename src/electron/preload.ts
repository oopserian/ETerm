import { contextBridge, ipcRenderer } from "electron";
const ipcInvoke = <Key extends keyof EventPayloadMapping>(
    key: Key,
    ...args: EventPayloadMapping[Key]['params']
): Promise<EventPayloadMapping[Key]['result']> => {
    return ipcRenderer.invoke(key, ...args);
};

const ipcOn = <Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]['params'][0]) => void
) => {
    ipcRenderer.on(key, (_, payload) => callback(payload))
};

export const host = {
    get: () => ipcInvoke('getHost'),
    save: (data: hostData) => ipcInvoke('saveHost', data),
    connect: (data: hostData) => ipcInvoke('connectHost', data)
};

export const common = {
    decryptPassword: (password: string, iv: string) => ipcInvoke('decryptPassword', password, iv)
};

export const terminal = {
    input: (data: EventPayloadMapping['terminalInput']['params'][0]) => ipcInvoke('terminalInput', data),
    subscribeOutput: (callback: (payload: EventPayloadMapping['terminalOutput']['params'][0]) => void) => ipcOn('terminalOutput', callback)
};

contextBridge.exposeInMainWorld('host', host);
contextBridge.exposeInMainWorld('common', common);
contextBridge.exposeInMainWorld('terminal', terminal);