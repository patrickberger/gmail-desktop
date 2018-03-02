import { app, Menu, Tray, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import * as path from 'path';
declare var __static: any;
const trayIconFile = path.join(__static, 'tray-icon.png');

let trayIcon: Tray | null;

function createContextMenu(win: BrowserWindow) : MenuItemConstructorOptions[] {

  return [
    {
      label: 'Toggle Window',
      click: () => {
        return win.isVisible() ? win.hide() : win.show();
      }
    },
    { type: 'separator' },
    { role: 'quit' }
  ];

}

export function create(win: BrowserWindow) : void {

  trayIcon = new Tray(trayIconFile);
  trayIcon.setToolTip(app.getName());
  trayIcon.setContextMenu(Menu.buildFromTemplate(createContextMenu(win)));

  // Events.
  trayIcon.on('click', () : void => {
    win.isVisible() ? win.hide() : win.show();
  });

}

