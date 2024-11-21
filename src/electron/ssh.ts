import { BrowserWindow } from "electron";
import { ipcMainHandle } from "./utils";

export default class SSH {
    mainWindow
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }
    registerHandlers() {
        ipcMainHandle('saveSSHData', (_, data) => this.save(data));
        ipcMainHandle('getSSHData', () => this.get());
    }
    save(data: any) {
        // ...
    }
    get(): sshData[] {
        return []
    }
}