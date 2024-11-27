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
        ipcMainHandle('getHost', () => this.get());
        ipcMainHandle('connectHost', (_, data) => this.connect(data));
    }
    connect(data: hostData): Promise<string> {
        return new Promise((resolve, reject) => {
            let termId = new Date().getTime().toString();
            let client = new Client();
            let password = Encryption.decryptPassword(data.password, data.password_iv!);
            client.on('ready', () => {
                client.shell((err, stream) => {
                    if (err) {
                        reject(err)
                        // throw err
                    };
                    this.Terminal.create(termId, client, stream);
                    stream.on('data', (res: any) => {
                        this.Terminal.output(termId, res)
                    });
                    resolve(termId)
                })
            }).on('error', (err) => {
                // let errStr = JSON.stringify(err);
                // this.Terminal.output(termId, `连接错误: ${errStr}\r\n`);
                reject(err)
                // throw err
            }).on('close', () => {
                // this.Terminal.output(termId, '已断开连接\r\n');
            }).connect({
                host: data.host,
                port: Number(data.port),
                username: data.username,
                password
            })
        })
    }
    save(data: hostData) {
        let dataStorage = new DataStorage();
        let hostData = dataStorage.load('host-data.json') || {};
        let id = `${data.host}:${data.port}`;
        let { encryptedPassword, iv } = Encryption.encryptPassword(data.password);
        hostData[id] = {
            id,
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
}