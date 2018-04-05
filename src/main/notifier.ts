import { app, Notification } from 'electron';
import * as path from 'path';
import * as util from 'util';

declare var __static: any;

/**
 * Notification handling.
 *
 * @export
 * @class Notifier
 */
export class Notifier {

  /**
   * Creates and shows a notification.
   *
   * @static
   * @param {string} message The notification message.
   * @param {string} [icon] The notification icon.
   * @returns {void}
   * @memberof Notifier
   */
  public static notify(message: string, icon?: string): void {

    // Skip if notifications aren't supported.
    if (!Notifier.isSupported) { return; }

    const n = new Notification({
      body: message,
      icon: icon || Notifier.defaultMessageIcon,
      title: app.getName(),
    });

    n.show();

  }

  private static readonly isSupported: boolean = Notification.isSupported();
  private static readonly defaultMessageIcon: string = path.join(__static, 'notification-icon-default.png');
  private static readonly unreadMessagesIcon: string = path.join(__static, 'notification-icon-unread.png');

  /**
   * Creates and shows a notifications about unread messages.
   *
   * @static
   * @param {number} count The number of unread messages.
   * @returns {void}
   * @memberof Notifier
   */
  public notifyUnread(count: number): void {

    // No message if
    // - there is nothing unread
    if (count <= 0) { return; }

    // Prepare message and go.
    const message = util.format((count > 1 ? '%d unread messages.' : '%d unread message.'), count);
    const icon = Notifier.unreadMessagesIcon;
    Notifier.notify(message, icon);

  }

}
