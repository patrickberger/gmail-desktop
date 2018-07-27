import { IpcMessageEvent, ipcRenderer as ipc } from 'electron';
import * as path from 'path';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import './app.less';

@Component({
  template: require('./app.html'),
})

export class App extends Vue {

  // @see https://github.com/electron-userland/electron-webpack/issues/52
  // tslint:disable-next-line:max-line-length
  private static readonly StaticPath: string = process.env.NODE_ENV === 'development' ? __static : __dirname.replace(/app\.asar$/, 'static').replace(/\\/g, '\\\\');

  public readonly injectScript: string;

  constructor() {
    super();

    // Initialize path to injection script.
    this.injectScript = path.join(App.StaticPath, 'inject.js');

  }

  public mounted(): void {

    ipc.on('toast-message', (e: IpcMessageEvent, ...args: any[]) => {
      // tslint:disable-next-line:no-console
      console.log('toast-message: e, args: ', e, args);

    });

  }

}
