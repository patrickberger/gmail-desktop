<div align="center">
  <img src="build/icons/tray-icon-unread.png" />
  <h1>Gmail Desktop</h1>
</div>

## Description

This is a simple, unofficial Google Mail wrapper for the desktop. Nothing special so far. This is intended to play around with Electron for educational purposes.

## Characteristics

This project is written in [Typescript](http://www.typescriptlang.org/) implementing some basic compnents an application should have. These are:

* Bundling using [electron-webpack](https://github.com/electron-userland/electron-webpack) which internally uses [webpack](https://github.com/webpack/webpack)
* Static entry point, see [src/main/main.ts](src/main/main.ts)
* Configuration using [electron-store](https://github.com/sindresorhus/electron-store) , see [src/main/config.ts](src/main/config.ts)
* Tray icon, minimize to tray functionality, see [src/main/application-tray.ts](src/main/application-tray.ts)
* Main menu including options selection, see [src/main/application-menu.ts](src/main/application-menu.ts)
* Notifications, see [src/main/notifier.ts](src/main/notifier.ts)
* Templating using [Vue.js](https://vuejs.org/) and [electron-webpack-vue](https://github.com/electron-userland/electron-webpack)

## Credits

* Icons: [Android Lollipop Icons](https://dtafalonso.deviantart.com/art/Android-Lollipop-Icons-491326893), [Android Style Honeycomb Icons by Wallec](http://www.iconarchive.com/show/android-style-honeycomb-icons-by-wwalczyszyn.html)
