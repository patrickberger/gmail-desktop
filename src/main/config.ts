import { BrowserWindowConstructorOptions, Rectangle } from 'electron';
import ElectronStore from 'electron-store';

/**
 * Application configuration.
 *
 * @export
 * @class Config
 */
export class Config {

  /** Default options object. */
  private static readonly defaultOptions = {
    autostart: false,
    enableNotifications: false,
    startMinimized: false,
    window: {
      height: 600,
      width: 800,
    },
  };

  /** Name of the storage file (without extension). */
  private readonly storeFileName = 'gmail-desktop-config';

  /** The configuration store. */
  private readonly store: ElectronStore;

  /**
   * Creates an instance of Config.
   * @memberof Config
   */
  constructor() {

    // Initialize store.
    this.store = new ElectronStore({
      defaults: Config.defaultOptions,
      name: this.storeFileName,
    });

  }

  /**
   * Updates specified config with last used window dimensions.
   *
   * @param {BrowserWindowConstructorOptions} config The window configuration.
   * @memberof Config
   */
  public addMainWindowConfiguration(config: BrowserWindowConstructorOptions): void {

    config.height = this.get('window.height');
    config.width = this.get('window.width');
    config.show = !this.get('startMinimized');

  }

  /**
   * Gets the value stored for specified key.
   *
   * @param {string} key The desired value's key.
   * @returns {*} The value stored for specified key.
   * @memberof Config
   */
  public get(key: string): any {
    return this.store.get(key);
  }

  /**
   * Sets specified key / value pair.
   *
   * @param {string} key The key.
   * @param {*} value The value.
   * @returns {Config} This instance.
   * @memberof Config
   */
  public set(key: string, value: any): Config {

    this.store.set(key, value);
    return this;

  }

  /**
   * Gets a value indicating whether notifications are enabled.
   *
   * @returns {boolean} True if the application should notify.
   * @memberof Config
   */
  public getIsNotificationsEnabled(): boolean {
    return this.get('enableNotifications');
  }

  /**
   * Stores the main window's bounds.
   *
   * @param {Rectangle} bounds The window bounds.
   * @returns {Config} This instance.
   * @memberof Config
   */
  public setWindowBounds(bounds: Rectangle): Config {

    return this
      .set('window.height', bounds.height)
      .set('window.width', bounds.width);

  }

}
