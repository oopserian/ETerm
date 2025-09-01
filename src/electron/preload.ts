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
    save: (data: Partial<HostData>) => ipcInvoke('saveHost', data),
    connect: (data: HostData) => ipcInvoke('connectHost', data),
    delete: (id: string) => ipcInvoke('deleteHost', id),
    update: (id: string, data: Partial<HostData>) => ipcInvoke('updateHost', id, data)
};

export const common = {
    decryptPassword: (password: string, iv: string) => ipcInvoke('decryptPassword', password, iv),
    openExternalUrl: (url: string) => ipcInvoke('openExternalUrl', url)
};

export const terminal = {
    subscribeOutput: (callback: (payload: EventPayloadMapping['terminalOutput']['params'][0]) => void) => ipcOn('terminalOutput', callback),
    subscribeUpdate: (callback: (payload: EventPayloadMapping['terminalUpdate']['params'][0]) => void) => ipcOn('terminalUpdate', callback),
    input: (data: EventPayloadMapping['terminalInput']['params'][0]) => ipcInvoke('terminalInput', data),
    getSessionLogs: (id: string) => ipcInvoke('getTerminalSessionLog', id),
    delete: (ids: string[]) => ipcInvoke('terminalDelete', ids),
    setWindowSize: (id: string, data: EventPayloadMapping['setTerminalWindowSize']['params'][1]) => ipcInvoke('setTerminalWindowSize', id, data)
};

export const commandSnippet = {
    create: (data: Partial<CommandSnippetData>) => ipcInvoke('createCommand', data),
    update: (id: number, data: Partial<CommandSnippetData>) => ipcInvoke('updateCommand', id, data),
    delete: (id: number) => ipcInvoke('deleteCommand', id),
    get: () => ipcInvoke('getCommand'),
};

contextBridge.exposeInMainWorld('host', host);
contextBridge.exposeInMainWorld('common', common);
contextBridge.exposeInMainWorld('terminal', terminal);
contextBridge.exposeInMainWorld('commandSnippet', commandSnippet);