import { app, BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions, shell } from 'electron';
import * as util from 'util';
import { GmailDesktop } from './gmail-desktop';

/**
 * Application menu.
 *
 * @export
 * @class ApplicationMenu
 */
export class ApplicationMenu {

  private readonly gmailApp: GmailDesktop;

  constructor(gmailApp: GmailDesktop) {

    this.gmailApp = gmailApp;
    this.initialize(this.gmailApp.getMainWindow());

  }

  /**
   * Applies the application menu to specified window.
   *
   * @static
   * @param {BrowserWindow} win The browser window instance.
   * @memberof MenuUtility
   */
  public initialize(win: BrowserWindow): void {

    const template = this.createTemplate();
    const menu = Menu.buildFromTemplate(template);
    win.setMenu(menu);

  }

  /**
   * Creates the menu template.
   *
   * @private
   * @returns {MenuItemConstructorOptions[]}
   * @memberof MenuUtility
   */
  private createTemplate(): MenuItemConstructorOptions[] {

    // Create a very basic menue.
    const appNameAndVersion: string = util.format('%s %s', `${APP_PRODUCTNAME}`, `${APP_VERSION}`);
    const homepage: string = `${APP_HOMEPAGE}`;
    const isAutostartEnabled = (!GmailDesktop.IsDevelopment) && this.gmailApp.getConfig().get('autostart');
    const template: MenuItemConstructorOptions[] = [
      {
        label: 'File',
        submenu: [
          { role: 'quit' },
        ],
      },
      {
        label: 'Options',
        submenu: [
          {
            checked: isAutostartEnabled,
            click: this.handleAutostartClick.bind(this),
            enabled: !GmailDesktop.IsDevelopment,
            label: 'Enable Autostart',
            type: 'checkbox',
          },
        ],
      },
      {
        label: 'Help',
        submenu: [
          {
            enabled: false,
            label: appNameAndVersion,
          },
          { type: 'separator' },
          {
            accelerator: process.platform === 'darwin' ? 'Option+Cmd+I' : 'F12',
            click(item, focusedWindow): void { focusedWindow.webContents.toggleDevTools(); },
            label: 'Developer Tools',
          },
          {
            accelerator: process.platform === 'darwin' ? 'Option+Cmd+J' : 'Ctrl+F12',
            click(item, focusedWindow): void { focusedWindow.webContents.send('open-wrapper-devtools'); },
            label: 'Content Developer Tools',
          },
          {
            click(item, focusedWindow): void { shell.openExternal(homepage); },
            label: 'Website',
          },
        ],
      },
    ];

    return template;

  }

  /**
   * Handles the Options > Enable Autostart menu item click.
   *
   * @private
   * @param {MenuItem} item The source menu item.
   * @param {BrowserWindow} focusedWindow The currently focused window.
   * @memberof ApplicationMenu
   */
  private handleAutostartClick(item: MenuItem, focusedWindow: BrowserWindow): void {

    // @see https://electronjs.org/docs/api/app#appsetloginitemsettingssettings-macos-windows
    app.setLoginItemSettings({
      openAsHidden: false,
      openAtLogin: item.checked,
    });

    // Update configuration.
    this.gmailApp.getConfig().set('autostart', item.checked);

  }

}
