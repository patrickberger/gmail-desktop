import { app, BrowserWindow, Menu, MenuItemConstructorOptions, Tray } from 'electron';
import * as path from 'path';

declare var __static: any;
const trayIconFile = path.join(__static, 'tray-icon.png');

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

  trayIcon = new Tray(trayIconFile);
  trayIcon.setTitle(app.getName());
  trayIcon.setToolTip(app.getName());
  trayIcon.setContextMenu(Menu.buildFromTemplate(createContextMenu(win)));

  // Events.
  trayIcon.on('click', () => toggleWindow(win));

}
