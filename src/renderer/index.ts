import { ipcRenderer as ipc, WebviewTag } from 'electron';

const wrapper: WebviewTag | null = document.querySelector('webview#wrapper');

ipc.on('open-wrapper-devtools', () => { if (wrapper) { wrapper.openDevTools(); } });
