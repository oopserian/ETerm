import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev, getPreloadPath } from "./lib/utils";
import Host from "./modules/host";
import Common from "./modules/common";
import Terminal from "./modules/terminal";
import Command from "./modules/command";

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 1000,
        minWidth: 800,
        height: 600,
        minHeight: 600,
        webPreferences: {
            preload: getPreloadPath()
        },
        backgroundColor: "transparent",
        titleBarStyle: 'hidden',
        trafficLightPosition: {
            x: 21,
            y: 21
        }
    });
    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }

    const terminal = new Terminal(mainWindow);
    terminal.registerHandlers();

    new Common(mainWindow).registerHandlers();
    new Host(mainWindow, terminal).registerHandlers();
    new Command(mainWindow).registerHandlers();
});