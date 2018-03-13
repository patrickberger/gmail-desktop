import { app, Notification } from 'electron';
import * as path from 'path';
import { format as formatString } from 'util';

declare var __static: any;

const isSupported: boolean = Notification.isSupported();
const defaultMessageIcon: string = path.join(__static, 'notification-icon-default.png');
const unreadMessagesIcon: string = path.join(__static, 'notification-icon-unread.png');

/**
 * Displays a notification message showing the number of unread messages.
 *
 * @param count The number of unread messages.
 */
export function notifyUnread(count: number): void {

  // No message if there is nothing unread.
  if (count <= 0) { return; }

  // Prepare message and go.
  const message = formatString((count > 1 ? '%d unread messages.' : '%d unread message.'), count);
  const icon = unreadMessagesIcon;
  notify(message, icon);

}

/**
 * Displays a notfication message.
 *
 * @param message The notification text.
 * @param icon The message icon.
 */
export function notify(message: string, icon?: string): void {

  if (!isSupported) { return; }

  const n = new Notification({
    body: message,
    icon: icon || defaultMessageIcon,
    title: app.getName(),
  });
  n.show();

}
