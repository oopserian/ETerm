import { app, ipcMain } from "electron";
import path from "path";

export const isDev = (): boolean => process.env.NODE_ENV == 'development';

export const getPreloadPath = (): string => path.join(app.getAppPath(), isDev() ? '.' : '..', '/dist-electron/preload.js');

export const ipcMainHandle = <Key extends keyof EventPayloadMapping>(
    key: Key,
    handle: (
        event: Electron.IpcMainInvokeEvent,
        ...args: EventPayloadMapping[Key]['params']
    ) => EventPayloadMapping[Key]['result']
) => {
    ipcMain.handle(key, handle);
}