import { BrowserWindow, shell } from "electron";
import { Encryption, ipcMainHandle } from "../lib/utils";

export default class Common {
    private mainWindow
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }
    registerHandlers() {
        ipcMainHandle('decryptPassword', (_, password, iv) => Encryption.decryptPassword(password, iv));
        ipcMainHandle('openExternalUrl', (_, url) => this.openExternalUrl(url));
    }
    
    openExternalUrl(url: string) {
        shell.openExternal(url);
    }
}