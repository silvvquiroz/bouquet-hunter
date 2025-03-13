const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 350,
        height: 430,
        autoHideMenuBar: true,
        resizable: false,
        icon: path.join(__dirname, 'assets/images/logo.ico'),
        frame: false,
        movable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
});


// listen to the close window event from renderer.js
ipcMain.on('close-window', ()=>{
    if(mainWindow) {
        mainWindow.close();
    }
});

ipcMain.on('minimize-window', ()=>{
    if(mainWindow) {
        mainWindow.minimize();
    }
});