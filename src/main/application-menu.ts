import { app, BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions, shell } from 'electron';
import * as util from 'util';
import { GmailDesktop } from './gmail-desktop';
import { ToastMessenger } from './toast-messenger';

/**
 * Application menu.
 *
 * @export
 * @class ApplicationMenu
 */
export class ApplicationMenu {

  private readonly gmailApp: GmailDesktop;

  private readonly messenger: ToastMessenger;

  constructor(gmailApp: GmailDesktop) {

    this.gmailApp = gmailApp;

    const mainWindow: BrowserWindow = gmailApp.getMainWindow();
    this.messenger = new ToastMessenger(mainWindow.webContents);
    this.initialize(mainWindow);

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
    const isNotificationsEnabled = this.gmailApp.getConfig().get('enableNotifications');
    const isStartingMinimized = this.gmailApp.getConfig().get('startMinimized');
    const messenger = this.messenger;

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
            checked: isNotificationsEnabled,
            click: this.handleEnableNotificationsClick.bind(this),
            label: 'Enable Notifications',
            type: 'checkbox',
          },
          {
            checked: isAutostartEnabled,
            click: this.handleAutostartClick.bind(this),
            enabled: !GmailDesktop.IsDevelopment,
            label: 'Enable Autostart',
            type: 'checkbox',
          },
          {
            checked: isStartingMinimized,
            click: this.handleStartMinimizedClick.bind(this),
            label: 'Start minimized',
            type: 'checkbox',
          },
        ],
      },
      {
        label: 'Development',
        submenu: [
          {
            accelerator: 'CmdOrCtrl+R',
            click(item, focusedWindow): void {
              if (focusedWindow) focusedWindow.reload();
            },
            label: 'Reload',
          },
          {
            accelerator: 'CmdOrCtrl+M',
            click(item, focusedWindow): void {
              messenger.confirm('Foo bar.');
            },
            label: 'Confirmation Toast',
          },
          {
            accelerator: 'CmdOrCtrl+M',
            click(item, focusedWindow): void {
              messenger.info('Foo bar.');
            },
            label: 'Information Toast',
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

  /**
   * Handles the Options > Enable Notifications menu item click.
   *
   * @private
   * @param {MenuItem} item The source menu item.
   * @param {BrowserWindow} focusedWindow The currently focused window.
   * @memberof ApplicationMenu
   */
  private handleEnableNotificationsClick(item: MenuItem, focusedWindow: BrowserWindow): void {

    // Update configuration.
    this.gmailApp.getConfig().set('enableNotifications', item.checked);

  }

  /**
   * Handles the Options > Enable Autostart menu item click.
   *
   * @private
   * @param {MenuItem} item The source menu item.
   * @param {BrowserWindow} focusedWindow The currently focused window.
   * @memberof ApplicationMenu
   */
  private handleStartMinimizedClick(item: MenuItem, focusedWindow: BrowserWindow): void {

    // Update configuration.
    this.gmailApp.getConfig().set('startMinimized', item.checked);

  }

}
