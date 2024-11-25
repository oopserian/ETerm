import { app, ipcMain } from "electron";
import path from "path";
import crypto from "crypto";
import fs from "fs";

export const isDev = (): boolean => process.env.NODE_ENV == 'development';

export const getPreloadPath = (): string => path.join(app.getAppPath(), isDev() ? '.' : '..', '/dist-electron/preload.js');

export const ipcMainHandle = <Key extends keyof EventPayloadMapping>(
    key: Key,
    handle: (
        event: Electron.IpcMainInvokeEvent,
        ...args: EventPayloadMapping[Key]['params']
    ) => EventPayloadMapping[Key]['result']
) => {
    ipcMain.handle(key, handle);
};


// 数据存储类
type FileNameType = 'ssh-data.json' | 'tag-data.json' | 'command-data.json';
export class DataStorage {
    private dataFolderPath = ''
    private whiteFiles: FileNameType[] = ['ssh-data.json', 'tag-data.json', 'command-data.json']
    constructor(folderName = 'data') {
        this.dataFolderPath = path.join(app.getPath('userData'), folderName);
        this.ensureFolderExists();
    }

    private isFileAllowed(fileName: FileNameType) {
        return this.whiteFiles.includes(fileName);
    }

    // 确保data文件夹存在
    private ensureFolderExists() {
        try {
            if (!fs.existsSync(this.dataFolderPath)) {
                fs.mkdirSync(this.dataFolderPath, { recursive: true });
                console.log(`文件夹存在: ${this.dataFolderPath}`);
            }
        } catch (error) {
            console.error(`加载文件夹失败: ${this.dataFolderPath}:`, error);
        }
    }

    // 保存数据到指定的文件
    save(data: any, fileName: FileNameType) {
        if (!this.isFileAllowed(fileName)) {
            console.error(`此文件${fileName}不在白名单里`);
            return
        };
        const filePath = path.join(this.dataFolderPath, fileName);
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
            console.log(`数据已保存到： ${filePath}`);
        } catch (error) {
            console.error(`保存数据失败 ${filePath}:`, error);
        }
    }

    // 从指定文件加载数据
    load(fileName: FileNameType) {
        if (!this.isFileAllowed(fileName)) {
            console.error(`此文件${fileName}不在白名单里`);
            return
        };
        const filePath = path.join(this.dataFolderPath, fileName);
        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf-8');
                console.log(`数据加载成功： ${filePath}`);
                return JSON.parse(data);
            } else {
                console.log(`文件 ${filePath} 没有找到. 返回空对象`);
                return {};
            }
        } catch (error) {
            console.error(`数据加载失败 ${filePath}:`, error);
            return {};
        }
    }
};

// 加密
export class Encryption {
    static readonly encryptionKey = '0010150609181217'; // 16字节密钥，AES-128
    // 加密
    static encryptPassword(password: string) {
        const iv = crypto.randomBytes(16);  // 随机生成初始化向量
        const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(this.encryptionKey), iv);
        let encrypted = cipher.update(password, 'utf-8', 'hex');
        encrypted += cipher.final('hex');
        return { encryptedPassword: encrypted, iv: iv.toString('hex') };
    }
    // 解密
    static decryptPassword(encryptedPassword: string, ivHex: string) {
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(this.encryptionKey), iv);
        let decrypted = decipher.update(encryptedPassword, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
    }
};
