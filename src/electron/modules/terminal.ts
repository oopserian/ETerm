import { BrowserWindow } from "electron";
import { ipcMainHandle } from "../lib/utils";

export default class Terminal {
    private mainWindow
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }
    registerHandlers() {
        ipcMainHandle('terminalInput', (_, command) => this.input(command));
    }
    input(command: string) {
        console.log(command)
    }
    output(){
        
    }
}