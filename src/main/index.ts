import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import * as appMenu from './app-menu';
import * as tray from './tray';

const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow: BrowserWindow | null;

function onClosed(): void {
  mainWindow = null;
}

function createWindowConfig(): BrowserWindowConstructorOptions {

  // Create window configuration.
  const config: BrowserWindowConstructorOptions = {
    height: 600,
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
  appMenu.create(mainWindow);
  tray.create(mainWindow);

  // Emitted when the window is closed.
  mainWindow.on('closed', onClosed);

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); }
});
