import { ipcRenderer as ipc, shell, WebviewTag } from 'electron';

let wrapper: WebviewTag | null;

onload = () => {

  // Get wrapper element; stop here if this fails.
  wrapper = document.querySelector('webview#wrapper');
  if (!wrapper) { return; }

  // Attach a (very) basic context menu.
  require('electron-context-menu')({ window: wrapper });

  wrapper.addEventListener('console-message', (e) => {
    // tslint:disable-next-line:no-console
    console.log('Guest logged: "' + e.message + '".');
  });

  // Events.
  wrapper.addEventListener('new-window', (e) => {
    // External links do not work by default. Need to handle.
    shell.openExternal(e.url);
  });

  // IPC.
  wrapper.addEventListener('ipc-message', (e) => {
    if (!wrapper) { return; }

    switch (e.channel) {

      case 'unread-count-changed':

        wrapper.send('get-unread-inbox-emails');
        break;

      case 'unread-inbox-emails':

        ipc.send('unread-count-changed', e.args[0]);
        break;

      case 'setup-completed':

        wrapper.send('get-unread-inbox-emails');
        ipc.send('gmail-initialized', e.args);
        break;

      default:

        // tslint:disable-next-line:no-console
        console.log('Received unhandled ipc-message via event listener: "' + e.channel + '"');
        break;

    }

  });

  // Wait for wrapper element to get ready.
  wrapper.addEventListener('dom-ready', () => {
    if (!wrapper) { return; }

    // wrapper.openDevTools();

  });

};

ipc.on('open-wrapper-devtools', () => {
  if (wrapper) { wrapper.openDevTools(); }
});

// Vue.
import App from '@/App.vue';
import Vue from 'vue';

new Vue({
  components: { App },
  template: '<app />',
}).$mount('#app');
