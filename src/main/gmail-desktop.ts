import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { EventEmitter } from 'events';
import * as path from 'path';
import * as url from 'url';
import * as util from 'util';
import { ApplicationTray } from './application-tray';
import { MenuUtility } from './menu-utility';
import { Notifier } from './notifier';

/**
 * Main application class.
 *
 * @export
 * @class GmailDesktop
 */
export class GmailDesktop extends EventEmitter {

  public static AppHomepage: string = `${APP_HOMEPAGE}`;

  public static AppName: string = `${APP_PRODUCTNAME}`;

  public static AppVersion: string = `${APP_VERSION}`;

  public static IsDevelopment: boolean = process.env.NODE_ENV !== 'production';

  /**
   * Creates and returns the options for the main window.
   *
   * @private @static
   * @returns {BrowserWindowConstructorOptions}
   * @memberof GmailDesktop
   */
  private static createWindowOptions(): BrowserWindowConstructorOptions {

    // Create window configuration.
    const config: BrowserWindowConstructorOptions = {
      height: 600,
      icon: path.join(__static, 'tray-icon-default.png'),
      title: `${APP_PRODUCTNAME}`,
      width: 800,
    };

    // Done.
    return config;

  }

  /** Indicates wether to force quitting or simpliy minimizing the application. */
  private forceQuit: boolean = false;

  /** The tray icon. */
  private tray: ApplicationTray;

  /** The number of unread messages. */
  private unreadMessages: number = 0;

  /** The logged in user's email address. */
  private userEmail: string = '<unknown>';

  /** The main window. */
  private window: BrowserWindow;

  /**
   * Creates an instance of GmailDesktop.
   *
   * @memberof GmailDesktop
   */
  constructor() {
    super();

    // Create and initialize the main window.
    this.window = this.createWindow();
    this.tray = new ApplicationTray(this.window);
    MenuUtility.initialize(this.window);

    // Wire up app and window events.
    // 'activate' is emitted when the user clicks the Dock icon (OS X).
    app.on('activate', () => this.window.show());
    // 'before-quit' is emitted when Electron receives the signal to exit and wants to start closing windows.
    app.on('before-quit', () => this.forceQuit = true);
    this.window.on('close', this.onClose.bind(this));
    this.window.on('closed', this.onClosed.bind(this));

  }

  /**
   * Opens the browser window.
   *
   * @memberof GmailDesktop
   */
  public openWindow(): void {

    if (GmailDesktop.IsDevelopment) {

      this.window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);

    } else {

      this.window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }));

    }

  }

  /**
   * Sets the number of currently unread messages.
   *
   * @param {number} unreadMessages The number of unread messages.
   * @returns {GmailDesktop}
   * @memberof GmailDesktop
   */
  public setUnreadMessages(unreadMessages: number): GmailDesktop {

    this.unreadMessages = unreadMessages;
    this.tray.markUnread(this.unreadMessages > 0);
    Notifier.notifyUnread(this.unreadMessages);

    // Done.
    return this;

  }

  /**
   * Sets the logged in user's email address.
   *
   * @param {string} userEmail The email address.
   * @returns {GmailDesktop}
   * @memberof GmailDesktop
   */
  public setUserEmail(userEmail: string): GmailDesktop {

    this.userEmail = userEmail;
    this.window.setTitle(util.format('%s | %s', this.userEmail, GmailDesktop.AppName));
    this.tray.setUserEmail(this.userEmail);

    // Done.
    return this;

  }

  /**
   * Creates, initializes and returns the main browser window.
   *
   * @private
   * @returns {BrowserWindow}
   * @memberof GmailDesktop
   */
  private createWindow(): BrowserWindow {

    // Create a window instance ...
    const options = GmailDesktop.createWindowOptions();
    const window = new BrowserWindow(options);

    // ... and return the result.
    return window;

  }

  /**
   * Handles the 'close' event of the main window.
   *
   * @private
   * @param {Event} e The source event.
   * @returns {void}
   * @memberof GmailDesktop
   */
  private onClose(e: Event): void {

    // Stop here if quitting the application is intended.
    if (this.forceQuit) { return; }

    // Stop the event; hide main window.
    e.preventDefault();
    this.window.hide();

  }

  private onClosed(e: Event): void {
    this.emit('closed');
  }

}
