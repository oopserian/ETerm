import { BrowserWindow } from "electron";
import { ipcMainHandle, ipcMainWebSend } from "../lib/utils";
import { Client, ClientChannel } from "ssh2";

export interface TerminalData{
    client: Client,
    stream: ClientChannel | null,
    sessionLogs: any,
    status: TerminalStatus
}

export default class Terminal {
    terms: Record<string, TerminalData> = {}
    private mainWindow
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }
    registerHandlers() {
        ipcMainHandle('terminalInput', (_, data) => this.input(data.id, data.command));
        ipcMainHandle('terminalDelete', (_, ids) => this.close(ids));
        ipcMainHandle('getTerminalSessionLog',(_, id)=> this.getSessionLog(id));
    }
    create(id: string, client: Client, stream?: ClientChannel) {
        this.terms[id] = {
            client,
            stream: stream || null,
            sessionLogs: '',
            status: 'connecting'
        };
    }
    getSessionLog(id:string){
        return this.terms[id].sessionLogs;
    }
    input(id: string, command: any) {
        this.terms[id].stream?.write(command);
    }
    output(id: string, data: any) {
        if(!this.terms[id]) return;
        this.terms[id].sessionLogs += data;
        ipcMainWebSend(this.mainWindow, 'terminalOutput', { id, data });
    }
    update(id: string, data: Partial<TerminalData>){
        this.terms[id] = {
            ...this.terms[id],
            ...data
        };
        let {status} = this.terms[id];
        ipcMainWebSend(this.mainWindow,'terminalUpdate',{id,status})
    }
    close(ids:string[]){
        ids.forEach(id=>{
            this.terms[id].stream?.destroy();
            this.terms[id].client.destroy();
            delete this.terms[id];
        })
    }
}