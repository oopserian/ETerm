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
): () => void => {
    const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
    ipcRenderer.on(key, cb);
    return () => ipcRenderer.off(key, cb);
};

export const host = {
    get: () => ipcInvoke('getHost'),
    save: (data: HostData) => ipcInvoke('saveHost', data),
    connect: (data: HostData) => ipcInvoke('connectHost', data),
    delete: (id: string) => ipcInvoke('deleteHost', id)
};

export const common = {
    decryptPassword: (password: string, iv: string) => ipcInvoke('decryptPassword', password, iv)
};

export const terminal = {
    subscribeOutput: (callback: (payload: EventPayloadMapping['terminalOutput']['params'][0]) => void) => ipcOn('terminalOutput', callback),
    subscribeUpdate: (callback: (payload: EventPayloadMapping['terminalUpdate']['params'][0]) => void) => ipcOn('terminalUpdate', callback),
    input: (data: EventPayloadMapping['terminalInput']['params'][0]) => ipcInvoke('terminalInput', data),
    getSessionLogs: (id: string) => ipcInvoke('getTerminalSessionLog', id),
    delete: (id: string) => ipcInvoke('terminalDelete', id)
};

export const commandSnippet = {
    create: (data: Partial<CommandSnippetData>) => ipcInvoke('createCommand', data),
    get: () => ipcInvoke('getCommand'),
};

contextBridge.exposeInMainWorld('host', host);
contextBridge.exposeInMainWorld('common', common);
contextBridge.exposeInMainWorld('terminal', terminal);
contextBridge.exposeInMainWorld('commandSnippet', commandSnippet);