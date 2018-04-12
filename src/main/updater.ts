import { AppUpdater, autoUpdater } from 'electron-updater';
import * as path from 'path';
import { Log } from './log';

// @see https://gist.github.com/iffy/0ff845e8e3f59dbe7eaf2bf24443f104

// Configure auto updater.
autoUpdater.autoDownload = false;
const logger = Log.getLogger();
logger.transports.file.level = 'info';
autoUpdater.logger = logger;

if (process.env.NODE_ENV !== 'production') {
  autoUpdater.updateConfigPath = path.join(__dirname, '..', '..', 'dev-app-update.yml');
}

/**
 * Auto updater class.
 *
 * @export
 * @class Updater
 */
export class Updater {

  private autoUpdater: AppUpdater;

  /**
   * Creates an instance of Updater.
   * @memberof Updater
   */
  constructor() {

    // Initialize.
    this.autoUpdater = autoUpdater;

    // Wire events.
    this.autoUpdater.on('update-downloaded', (e, i) => {
      this.quitAndInstall();
    });

  }

  /**
   * Checks for updates.
   *
   * @memberof Updater
   */
  public check(): void {
    this.autoUpdater.checkForUpdates();
  }

  /**
   * Quits the application and installs the update.
   *
   * @private
   * @memberof Updater
   */
  private quitAndInstall(): void {

    setTimeout(() => {
      this.autoUpdater.quitAndInstall();
    }, 5000);

  }

}
