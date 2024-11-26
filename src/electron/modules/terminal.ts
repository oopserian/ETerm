import { BrowserWindow } from "electron";
import { ipcMainHandle, ipcMainWebSend } from "../lib/utils";
import { common } from "../preload";

export default class Terminal {
    private mainWindow
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }
    registerHandlers() {
        ipcMainHandle('terminalInput', (_, data) => this.input(data.id, data.command));
    }
    input(id: string, command: any) {
        console.log(id, command)
    }
    output(id: string, data: any) {
        ipcMainWebSend(this.mainWindow, 'terminalOutput', { id, data });
    }
}