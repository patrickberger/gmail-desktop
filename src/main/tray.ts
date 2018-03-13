import { app, BrowserWindow, Menu, MenuItemConstructorOptions, Tray } from 'electron';
import * as path from 'path';

declare var __static: any;
const defaultTrayIcon: string = path.join(__static, 'tray-icon-default.png');
const unreadTrayIcon: string = path.join(__static, 'tray-icon-unread.png');

let trayIcon: Tray | null;

function toggleWindow(win: BrowserWindow): void {
  win.isVisible() ? win.hide() : win.show();
}

function createContextMenu(win: BrowserWindow): MenuItemConstructorOptions[] {

  return [
    {
      click: () => { toggleWindow(win); },
      label: 'Toggle Window',
    },
    { type: 'separator' },
    { role: 'quit' },
  ];

}

export function create(win: BrowserWindow): void {

  trayIcon = new Tray(defaultTrayIcon);
  trayIcon.setTitle(app.getName());
  trayIcon.setToolTip(app.getName());
  trayIcon.setContextMenu(Menu.buildFromTemplate(createContextMenu(win)));

  // Events.
  trayIcon.on('click', () => toggleWindow(win));

}

export function markUnread(hasUnread?: boolean): void {

  if (!trayIcon) { return; }

  const hasUnreadMails = hasUnread || false;
  trayIcon.setImage(hasUnreadMails ? unreadTrayIcon : defaultTrayIcon);

}
