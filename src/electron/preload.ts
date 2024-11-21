import { contextBridge, ipcRenderer } from "electron";

export const ssh = {
    getData(){
    }
}

contextBridge.exposeInMainWorld('ssh', ssh);