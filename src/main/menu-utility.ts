import { BrowserWindow, Menu, MenuItemConstructorOptions, shell } from 'electron';

// tslint:disable-next-line:no-var-requires
const constants = require('./constants.json');

/**
 * Application menu.
 *
 * @export
 * @class ApplicationMenu
 */
export class MenuUtility {

  /**
   * Applies the application menu to specified window.
   *
   * @static
   * @param {BrowserWindow} win The browser window instance.
   * @memberof MenuUtility
   */
  public static initialize(win: BrowserWindow): void {

    const template = MenuUtility.createTemplate();
    const menu = Menu.buildFromTemplate(template);
    win.setMenu(menu);

  }

  /**
   * Creates the menu template.
   *
   * @private
   * @static
   * @returns {MenuItemConstructorOptions[]}
   * @memberof MenuUtility
   */
  private static createTemplate(): MenuItemConstructorOptions[] {

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

    return template;

  }

}
