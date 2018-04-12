import { app } from 'electron';
import * as path from 'path';
import * as winston from 'winston';

/**
 * Application logger.
 *
 * @export
 * @class Logger
 * @see https://github.com/winstonjs/winston/tree/2.4.0
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
    Log.logger.log('debug', message, ...params);
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
    Log.logger.log('error', message, ...params);
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
    Log.logger.log('info', message, ...params);
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
    Log.logger.log('warn', message, ...params);
  }

  /**
   * Static ctor.
   *
   * @static
   * @memberof Logger
   * @see https://github.com/Microsoft/TypeScript/issues/265#issuecomment-50255298
   */
  public static initialize() {

    // Stop here if already invoked.
    if (Log.isInitialized) return;
    Log.isInitialized = true;

    // Create a logger instance.
    Log.logger = Log.createLogger();

  }

  /**
   * Gets the wrapped logger instance.
   *
   * @static
   * @returns {winston.LoggerInstance}
   * @memberof Log
   */
  public static getLogger(): winston.LoggerInstance {
    return Log.logger;
  }

  /** Whether this class is already initialized. */
  private static isInitialized: boolean = false;

  /** The logger instance. */
  private static logger: winston.LoggerInstance;

  /**
   * Creates a logger instance for this application.
   *
   * @private
   * @static
   * @returns {winston.LoggerInstance}
   * @memberof Log
   */
  private static createLogger(): winston.LoggerInstance {

    // Create the log targets ...
    const transports: winston.TransportInstance[] = [];
    transports.push(new winston.transports.Console());
    transports.push(new winston.transports.File({
      filename: path.join(app.getPath('userData'), 'gmail-desktop.log'),
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }));

    // ... create an options object ...
    const options: winston.LoggerOptions = {
      level: 'info',
      transports,
    };

    // ... create the logger object.
    return new winston.Logger(options);

  }

}

// Initialilize logging.
Log.initialize();
