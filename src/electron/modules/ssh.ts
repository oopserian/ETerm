import { BrowserWindow } from "electron";
import { DataStorage, Encryption, ipcMainHandle } from "../lib/utils";
import { Client, ClientChannel } from "ssh2";

export default class SSH {
    clients: Record<string, { client: Client, stream: ClientChannel | null }> = {}
    private mainWindow
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }
    registerHandlers() {
        ipcMainHandle('saveSSHData', (_, data) => this.save(data));
        ipcMainHandle('getSSHData', () => this.get());
    }
    connect(data: sshData) {
        let client = new Client();
        this.clients[data.id!].client = client;
        let password = Encryption.decryptPassword(data.password, data.password_iv!);
        client.on('ready', () => {
            client.shell((err, stream) => {
                this.clients[data.id!].stream = stream;
                stream.on('data', () => {
                    console.log()
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
    get(): sshData[] {
        let dataStorage = new DataStorage();
        let sshData = dataStorage.load('ssh-data.json') || {};
        return sshData;
    }
}