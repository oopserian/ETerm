import { BrowserWindow } from "electron";
import { Encryption, ipcMainHandle } from "../lib/utils";

export default class Common {
    private mainWindow
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }
    registerHandlers() {
        ipcMainHandle('decryptPassword', (_, password, iv) => Encryption.decryptPassword(password, iv));
    }
}