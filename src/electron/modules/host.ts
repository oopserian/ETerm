import { BrowserWindow } from "electron";
import { DataStorage, Encryption, ipcMainHandle } from "../lib/utils";
import { Client } from "ssh2";
import Terminal from "./terminal";

export default class Host {
    private mainWindow
    private Terminal
    constructor(mainWindow: BrowserWindow, terminal: Terminal) {
        this.mainWindow = mainWindow;
        this.Terminal = terminal;
    }
    registerHandlers() {
        ipcMainHandle('saveHost', (_, data) => this.save(data));
        ipcMainHandle('updateHost', (_, id, data) => this.update(id, data));
        ipcMainHandle('getHost', () => this.get());
        ipcMainHandle('deleteHost', (_, id) => this.delete(id));
        ipcMainHandle('connectHost', (_, data) => this.connect(data));
    }
    connect(data: HostData): Promise<string> {
        return new Promise((resolve, reject) => {
            let termId = new Date().getTime().toString();
            let client = new Client();
            this.Terminal.create(termId, client);
            resolve(termId)
            let password = Encryption.decryptPassword(data.password, data.password_iv!);
            client.on('ready', () => {
                client.shell((err, stream) => {
                    if (err) {
                        let errStr = JSON.stringify(err);
                        this.Terminal.output(termId, `\x1b[31m连接失败:\x1b[39m ${errStr}\r\n\r\n`);
                        this.Terminal.update(termId, {
                            status: 'error'
                        });
                        reject(err)
                    };

                    if (stream) {
                        this.Terminal.update(termId, {
                            stream,
                            status: 'connected'
                        });

                        stream.on('data', (res: any) => {
                            this.Terminal.output(termId, res);
                        });
                    }
                })
            }).on('error', (err) => {
                let errStr = JSON.stringify(err);
                this.Terminal.output(termId, `\x1b[31m连接失败:\x1b[39m ${errStr}\r\n\r\n`);
                this.Terminal.update(termId, { status: 'error' });
                reject(err)
            }).on('close', () => {
                // this.Terminal.update(termId,{ status: 'closed' });
                this.Terminal.output(termId, '\x1b[31m已断开连接\x1b[39m\r\n');
            }).connect({
                host: data.host,
                port: Number(data.port),
                username: data.username,
                password
            })
        })
    }
    save(data: Partial<HostData>) {
        let dataStorage = new DataStorage();
        let hostData = dataStorage.load('host-data.json') || {};
        let id = `${data.host}:${data.port}`;
        let { encryptedPassword, iv } = Encryption.encryptPassword(data.password!);
        hostData[id] = {
            id,
            ...data,
            password: encryptedPassword,
            password_iv: iv
        };
        dataStorage.save(hostData, 'host-data.json');
    }
    update(id: string, data: Partial<HostData>) {
        let dataStorage = new DataStorage();
        let hostData = dataStorage.load('host-data.json') || {};
        let { encryptedPassword, iv } = Encryption.encryptPassword(data.password!);
        delete hostData[id];
        hostData[id] = {
            ...data,
            password: encryptedPassword,
            password_iv: iv
        };
        dataStorage.save(hostData, 'host-data.json');
    }
    get() {
        let dataStorage = new DataStorage();
        let hostData = dataStorage.load('host-data.json') || {};
        return hostData;
    }
    delete(id: string) {
        let dataStorage = new DataStorage();
        let hostData = dataStorage.load('host-data.json') || {};
        delete hostData[id];
        dataStorage.save(hostData, 'host-data.json');
    }
}