import { BrowserWindow } from "electron";
import { ipcMainHandle, ipcMainWebSend } from "../lib/utils";
import { Client, ClientChannel } from "ssh2";

export default class Terminal {
    terms: Record<string, { client: Client, stream: ClientChannel | null }> = {}
    private mainWindow
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }
    registerHandlers() {
        ipcMainHandle('terminalInput', (_, data) => this.input(data.id, data.command));
    }
    create(id: string, client: Client, stream?: ClientChannel) {
        this.terms[id] = {
            client,
            stream: stream || null
        };
    }
    input(id: string, command: any) {
        console.log(id, command)
        this.terms[id].stream?.write(command);
    }
    output(id: string, data: any) {
        ipcMainWebSend(this.mainWindow, 'terminalOutput', { id, data });
    }
}