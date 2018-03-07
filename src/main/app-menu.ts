import { BrowserWindow, Menu, MenuItemConstructorOptions, shell } from 'electron';

// tslint:disable-next-line:no-var-requires
const constants = require('./constants.json');

export function create(win: BrowserWindow) {

  // Create a very basic menue.
  const template: MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          { role: 'quit' },
        ],
      },
      {
        label: 'Help',
        submenu: [
          {
            accelerator: process.platform === 'darwin' ? 'Option+Cmd+I' : 'F12',
            click(item, focusedWindow): void { focusedWindow.webContents.toggleDevTools(); },
            label: 'Developer Tools',
          },
          {
            accelerator: process.platform === 'darwin' ? 'Option+Cmd+I' : 'Ctrl+F12',
            click(item, focusedWindow): void { focusedWindow.webContents.send('open-wrapper-devtools'); },
            label: 'Content Developer Tools',
          },
          {
            click(item, focusedWindow): void { shell.openExternal(constants.homepage); },
            label: 'Website',
          },
        ],
      },
    ];
  const appMenu = Menu.buildFromTemplate(template);

  // Apply menue.
  win.setMenu(appMenu);

}
