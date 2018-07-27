import { app } from 'electron';
import { configure, getLogger, Logger } from 'log4js';
import * as path from 'path';

/**
 * Application logger.
 *
 * @export
 * @class Logger
 * @see https://github.com/log4js-node/log4js-node
 */
export class Log {

  /**
   * Logs a debug message.
   *
   * @static
   * @param {string} message The message
   * @param {...any[]} params The message parameters.
   * @memberof Logger
   */
  public static debug(message: string, ...params: any[]): void {
    Log.getLogger().debug(message, ...params);
  }

  /**
   * Logs an error message.
   *
   * @static
   * @param {string} message The message
   * @param {...any[]} params The message parameters.
   * @memberof Logger
   */
  public static error(message: string, ...params: any[]): void {
    Log.getLogger().error(message, ...params);
  }

  /**
   * Logs an information message.
   *
   * @static
   * @param {string} message The message
   * @param {...any[]} params The message parameters.
   * @memberof Logger
   */
  public static info(message: string, ...params: any[]): void {
    Log.getLogger().info(message, ...params);
  }

  /**
   * Logs a warning message.
   *
   * @static
   * @param {string} message The message
   * @param {...any[]} params The message parameters.
   * @memberof Logger
   */
  public static warn(message: string, ...params: any[]): void {
    Log.getLogger().warn(message, ...params);
  }

  /**
   * Static ctor.
   *
   * @static
   * @memberof Logger
   * @see https://github.com/Microsoft/TypeScript/issues/265#issuecomment-50255298
   */
  public static initialize(): void {

    // Stop here if already invoked.
    if (Log.isInitialized) return;
    Log.isInitialized = true;

    // Configure logger.
    const userPath = app.getPath('userData');
    const defaultFilePath: string = path.resolve(userPath, 'gmail-desktop.log');
    const updaterFilePath: string = path.resolve(userPath, 'gmail-desktop-update.log');
    configure({
      appenders: {
        defaultConsole: { type: 'console' },
        defaultFile: {
          backups: 2,
          compress: true,
          filename: defaultFilePath,
          maxLogSize: 1048576, // 1 MB.
          type: 'file',
        },
        uppdateFile: {
          backups: 1,
          compress: true,
          filename: updaterFilePath,
          maxLogSize: 1048576, // 1 MB.
          type: 'file',
        },
      },
      categories: {
        default: { appenders: ['defaultFile', 'defaultConsole'], level: 'info'},
        updater: { appenders: ['uppdateFile', 'defaultConsole'], level: 'info'},
      },
    });

  }

  /**
   * Gets the wrapped logger instance.
   *
   * @static
   * @returns {log4js.Logger}
   * @memberof Log
   */
  public static getLogger(category?: string): Logger {
    return getLogger(category);
  }

  /** Whether this class is already initialized. */
  private static isInitialized: boolean = false;

}

// Initialilize logging.
Log.initialize();
