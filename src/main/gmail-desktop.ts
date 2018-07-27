import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { EventEmitter } from 'events';
import * as path from 'path';
import * as url from 'url';
import * as util from 'util';
import { ApplicationMenu } from './application-menu';
import { ApplicationTray } from './application-tray';
import { Config } from './config';
import { Log } from './log';
import { Notifier } from './notifier';
import { ToastMessenger } from './toast-messenger';
import { Updater } from './updater';

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

  /** The application config. */
  private config: Config = new Config();

  /** Indicates wether to force quitting or simpliy minimizing the application. */
  private forceQuit: boolean = false;

  /** The window messenger. */
  private messenger: ToastMessenger;

  /** The notifier. */
  private notifier: Notifier;

  /** The tray icon. */
  private tray: ApplicationTray;

  /** The number of unread messages. */
  private unreadMessages: number = 0;

  private updater: Updater;

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

    // Hello, world.
    Log.info('Application startup.');

    // Create and initialize the main window.
    this.window = this.createWindow();
    this.notifier = new Notifier();
    this.tray = new ApplicationTray(this.window);
    this.messenger = new ToastMessenger(this.window.webContents);
    this.updater = new Updater(this.messenger);

    // Wire up app and window events.
    // 'before-quit' is emitted when Electron receives the signal to exit and wants to start closing windows.
    app.on('before-quit', () => this.forceQuit = true);
    this.window.on('close', this.onClose.bind(this));
    this.window.on('closed', this.onClosed.bind(this));
    this.window.on('ready-to-show', this.onReadyToShow.bind(this));

  }

  /**
   * Gets the app configuration object.
   *
   * @returns {Config} The app configuration.
   * @memberof GmailDesktop
   */
  public getConfig(): Config {
    return this.config;
  }

  /**
   * Gets the main window.
   *
   * @returns {BrowserWindow} The application's main window.
   * @memberof GmailDesktop
   */
  public getMainWindow(): BrowserWindow {
    return this.window;
  }

  /**
   * Gets the updater object.
   *
   * @returns {Updater}
   * @memberof GmailDesktop
   */
  public getUpdater(): Updater {
    return this.updater;
  }

  /**
   * Opens the browser window.
   *
   * @memberof GmailDesktop
   */
  public openWindow(): void {

    // tslint:disable-next-line:no-unused-expression
    new ApplicationMenu(this);

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

    // Done.
    return this;

  }

  /**
   * Informs the application about a new email.
   *
   * @returns {GmailDesktop}
   * @memberof GmailDesktop
   */
  public setHasNewMail(): GmailDesktop {

    const isEnabled = this.getConfig().getIsNotificationsEnabled();
    if (isEnabled) this.notifier.notifyUnread(this.unreadMessages);

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
    const options = this.createWindowOptions();
    const window = new BrowserWindow(options);

    // ... and return the result.
    return window;

  }

  /**
   * Creates and returns the options for the main window.
   *
   * @private
   * @returns {BrowserWindowConstructorOptions}
   * @memberof GmailDesktop
   */
  private createWindowOptions(): BrowserWindowConstructorOptions {

    // Create window configuration.
    const config: BrowserWindowConstructorOptions = {
      icon: path.join(__static, 'tray-icon-default.png'),
      show: false,
      title: `${APP_PRODUCTNAME}`,
    };
    this.config.addMainWindowConfiguration(config);

    // Done.
    return config;

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

    // Update user configuration.
    const windowBounds = this.window.getBounds();
    this.config.setWindowBounds(windowBounds);

    // Stop here if quitting the application is intended.
    if (this.forceQuit) { return; }

    // Stop the event; hide main window.
    e.preventDefault();
    this.window.hide();

  }

  private onClosed(e: Event): void {
    this.emit('closed');
  }

  /**
   * Handles the main window's 'ready-to-show' event.
   *
   * @private
   * @param {Event} e
   * @memberof GmailDesktop
   */
  private onReadyToShow(e: Event): void {

    // Display the window eventually.
    const showWindow = !this.config.get('startMinimized');
    if (showWindow) this.window.show();

    // Trigger updater.
    this.updater.check();
  }

}
