import { BrowserWindow } from "electron";
import { DataStorage, Encryption, ipcMainHandle } from "../lib/utils";
import { Client } from "ssh2";
import Terminal from "./terminal";

export default class SSH {
    private mainWindow
    private Terminal
    constructor(mainWindow: BrowserWindow, terminal: Terminal) {
        this.mainWindow = mainWindow;
        this.Terminal = terminal;
    }
    registerHandlers() {
        ipcMainHandle('saveSSH', (_, data) => this.save(data));
        ipcMainHandle('getSSH', () => this.get());
        ipcMainHandle('connectSSH', (_, data) => this.connect(data));
    }
    connect(data: sshData) {
        let id = data.id!;
        let client = new Client();
        let password = Encryption.decryptPassword(data.password, data.password_iv!);
        client.on('ready', () => {
            client.shell((err, stream) => {
                this.Terminal.create(id, client, stream);
                stream.on('data', (res: any) => {
                    this.Terminal.output(id, res)
                })
            })
        }).connect({
            host: data.host,
            port: Number(data.port),
            username: data.username,
            password
        })
    }
    save(data: sshData) {
        let dataStorage = new DataStorage();
        let sshData = dataStorage.load('ssh-data.json') || {};
        let id = `${data.host}:${data.port}`;
        let { encryptedPassword, iv } = Encryption.encryptPassword(data.password);
        sshData[id] = {
            id,
            ...data,
            password: encryptedPassword,
            password_iv: iv
        };
        dataStorage.save(sshData, 'ssh-data.json');
    }
    get() {
        let dataStorage = new DataStorage();
        let sshData = dataStorage.load('ssh-data.json') || {};
        return sshData;
    }
}