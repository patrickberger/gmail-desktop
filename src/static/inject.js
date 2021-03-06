const ipc = require('electron').ipcRenderer;
const path = require('path');

let gmail = null;

window.onload = function() {

  // Inject jquery and Gmail.js into current webview.
  window.$ = window.jQuery = require(path.resolve(__dirname, 'jquery.min.js'));
  const GmailFactory = require(path.resolve(__dirname, 'gmail.js'));
  gmail = GmailFactory.Gmail(window.$);
  window.gmail = gmail;

  // Event handler.
  const unreadCheckHander = function () {
    // On marked read, unread, deletion; notify inbox unread count might have changed.
    ipc.sendToHost('unread-count-changed');
  };
  const newMailHandler = function () {
    // On new mail: Notify about it; notify inbox unread count might have changed.
    ipc.sendToHost('new-mail');
    ipc.sendToHost('unread-count-changed');
  };

  // Set up new-email listener.
  gmail.observe.on('load', function() {

    // Observe unread count.
    gmail.observe.on('new_email', unreadCheckHander);
    gmail.observe.on('read', unreadCheckHander);
    gmail.observe.on('unread', unreadCheckHander);
    gmail.observe.on('delete', unreadCheckHander);

    // Check and tell main renderer, we are ready.
    const userEmail = gmail.get.user_email();
    ipc.sendToHost('setup-completed', userEmail);

  });

};

ipc.on('get-user-email', function() {
  ipc.sendToHost('user-email', gmail.get.user_email());
});

ipc.on('get-unread-inbox-emails', function() {
  ipc.sendToHost('unread-inbox-emails', gmail.get.unread_inbox_emails());
});
