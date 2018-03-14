import { app, BrowserWindow, Menu, MenuItemConstructorOptions, Tray } from 'electron';
import * as path from 'path';
import * as util from 'util';

declare var __static: any;

/**
 * Application tray.
 */
export class ApplicationTray {

  /**
   * Creates, initializes and returns a tray context menu.
   *
   * @param win The browser window.
   */
  public static createContextMenu(win: BrowserWindow): MenuItemConstructorOptions[] {

    return [
      {
        click: () => { ApplicationTray.toggleWindow(win); },
        label: 'Toggle Window',
      },
      { type: 'separator' },
      { role: 'quit' },
    ];

  }

  /**
   * Toggles specified window's visibility state.
   *
   * @param win The browser window.
   */
  public static toggleWindow(win: BrowserWindow): void {

    win.isVisible() ? win.hide() : win.show();

  }

  /**
   * The default tray icon image.
   *
   * @private
   * @static
   * @type {string}
   * @memberof ApplicationTray
   */
  private static defaultTrayIcon: string = path.join(__static, 'tray-icon-default.png');

  /**
   * The tray icon image indicating unread mails.
   *
   * @private
   * @static
   * @type {string}
   * @memberof ApplicationTray
   */
  private static unreadTrayIcon: string = path.join(__static, 'tray-icon-unread.png');

  /**
   * The system tray icon instance.
   *
   * @private
   * @type {Tray}
   * @memberof ApplicationTray
   */
  private readonly trayIcon: Tray;

  /**
   * The browser window instance.
   *
   * @private
   * @type {BrowserWindow}
   * @memberof ApplicationTray
   */
  private readonly win: BrowserWindow;

  /**
   * Creates an instance of ApplicationTray.
   *
   * @param {BrowserWindow} win The associated browser window.
   * @memberof ApplicationTray
   */
  constructor(win: BrowserWindow) {

    this.win = win;

    this.trayIcon = new Tray(ApplicationTray.defaultTrayIcon);
    this.trayIcon.setTitle(app.getName());
    this.trayIcon.setToolTip(app.getName());
    this.trayIcon.setContextMenu(Menu.buildFromTemplate(ApplicationTray.createContextMenu(this.win)));

    // Events.
    this.trayIcon.on('click', () => ApplicationTray.toggleWindow(this.win));
  }

  /**
   * Marks the tray icon having unread emails.
   *
   * @param {boolean} [isUnread] Whether there are unread emails.
   * @memberof ApplicationTray
   */
  public markUnread(isUnread?: boolean): void {

    const hasUnreadMails = isUnread || false;
    this.trayIcon.setImage(hasUnreadMails ? ApplicationTray.unreadTrayIcon : ApplicationTray.defaultTrayIcon);

  }

  /**
   * Sets the user's email address. Updates the tray icon's title.
   *
   * @param {string} userEmail The email address associated with current account.
   * @memberof ApplicationTray
   */
  public setUserEmail(userEmail: string): void {

    const trayTitle = util.format('%s | %s', userEmail, app.getName());
    this.trayIcon.setTitle(trayTitle);
    this.trayIcon.setToolTip(trayTitle);

  }

}
