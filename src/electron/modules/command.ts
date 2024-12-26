import { BrowserWindow } from "electron";
import { DataStorage, ipcMainHandle } from "../lib/utils";

export default class Command {
    private mainWindow
    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }
    registerHandlers() {
        ipcMainHandle('createCommand', (_, data) => this.create(data));
        ipcMainHandle('updateCommand', (_, id, data) => this.update(id, data));
        ipcMainHandle('deleteCommand', (_, id) => this.delete(id));
        ipcMainHandle('getCommand', (_) => this.get());
    }
    create(data: Partial<CommandSnippetData>) {
        let dataStorage = new DataStorage();
        let commandData = dataStorage.load('command-data.json') || {};
        let id = new Date().getTime();
        commandData[id] = {
            ...data,
            id
        };
        dataStorage.save(commandData, 'command-data.json');
    }
    update(id: number, data: Partial<CommandSnippetData>) {
        let dataStorage = new DataStorage();
        let commandData = dataStorage.load('command-data.json') || {};
        if (commandData[id]) {
            commandData[id] = {
                ...commandData[id],
                ...data
            }
        };
        dataStorage.save(commandData, 'command-data.json');
    }
    get() {
        let dataStorage = new DataStorage();
        let data = dataStorage.load('command-data.json') || {};
        return data
    }
    delete(id: number) {
        let dataStorage = new DataStorage();
        let data = dataStorage.load('command-data.json') || {};
        delete data[id];
        dataStorage.save(data, 'command-data.json');
    }
}