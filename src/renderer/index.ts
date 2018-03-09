import { WebviewTag } from 'electron';

let wrapper: WebviewTag | null;

onload = () => {

  // Get wrapper element; stop here if this fails.
  wrapper = document.querySelector('webview#wrapper');
  if (!wrapper) { return; }

  // Wait for wrapper element to get ready.
  wrapper.addEventListener('dom-ready', () => {
    if (!wrapper) { return; }

    wrapper.openDevTools();

    const command = `document.querySelector('a[href="https://mail.google.com/mail/u/0/#inbox"]').getAttribute('title')`;
    wrapper.executeJavaScript(command, false, (result) => {
      // tslint:disable-next-line:no-console
      console.log(result);
    });

  });

};

// Vue.
import App from '@/App.vue';
import Vue from 'vue';

new Vue({
  components: { App },
  template: '<app />',
}).$mount('#app');
