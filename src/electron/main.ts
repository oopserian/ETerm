import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev, getPreloadPath } from "./utils";
import SSH from "./ssh";

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        minWidth: 800,
        height: 800,
        minHeight: 600,
        webPreferences: {
            preload: getPreloadPath()
        }
    });
    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }

    new SSH(mainWindow).registerHandlers();
});