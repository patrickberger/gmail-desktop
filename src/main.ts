import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null;

function onClosed() : void {
  mainWindow = null;
}

function createWindow() : void {

  // Create window and load remote url.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL('https://mail.google.com/mail/u/0/#inbox');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', onClosed);

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);