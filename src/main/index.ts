import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain as ipc, IpcMessageEvent } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import * as util from 'util';
import { ApplicationTray } from './application-tray';
import { MenuUtility } from './menu-utility';
import { Notifier } from './notifier';

declare var __static: any;
const isDevelopment = process.env.NODE_ENV !== 'production';
let mainWindow: BrowserWindow | null;
let forceQuit: boolean = false;
let tray: ApplicationTray | null;

function onClosed(): void {
  mainWindow = null;
}

function createWindowConfig(): BrowserWindowConstructorOptions {

  // Create window configuration.
  const config: BrowserWindowConstructorOptions = {
    height: 600,
    icon: path.join(__static, 'tray-icon-default.png'),
    title: 'Gmail Desktop',
    width: 800,
  };

  // Done.
  return config;

}

function createWindow(): void {

  const constants = require('./constants.json');
  const windowConfig = createWindowConfig();

  // Prepare the app.
  app.setName(constants.productName);

  // Create window and load remote url.
  mainWindow = new BrowserWindow(windowConfig);

  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    mainWindow.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true,
    }));
  }

  // Configure menue and tray icon.
  MenuUtility.initialize(mainWindow);
  tray = new ApplicationTray(mainWindow);

  // Emitted when the user is attempting to close the window.
  // Instead of closing the application: Just minimize it.
  mainWindow.on('close', (e: Event) => {
    if (forceQuit) { return; }

    e.preventDefault();
    if (mainWindow) { mainWindow.hide(); }

  });

  // Emitted when the window is closed.
  mainWindow.on('closed', onClosed);

}

// 'activate' is emitted when the user clicks the Dock icon (OS X).
app.on('activate', () => { if (mainWindow) { mainWindow.show(); }});

// 'before-quit' is emitted when Electron receives the signal to exit and wants to start closing windows.
app.on('before-quit', () => forceQuit = true);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); }
});

/*********
 * IPC.
 *********/

// Unread inbox count changes.
ipc.on('unread-count-changed', (e: IpcMessageEvent, ...args: any[]): void => {

  // Get number of messages.
  const count: number = args[0] ? args[0] : 0;
  if (tray) { tray.markUnread(count > 0); }
  Notifier.notifyUnread(count);

});

// Gmail has been connected.
ipc.on('gmail-initialized', (e: IpcMessageEvent, ...args: any[]): void => {

  // Do some initial setup.
  const userEmail: string = args[0] ? args[0] : '<unknown>';
  if (mainWindow) { mainWindow.setTitle(util.format('%s | Gmail Desktop', userEmail)); }
  if (tray) { tray.setUserEmail(userEmail); }

});
