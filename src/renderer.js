const { remote, ipcRenderer } = require('electron');
const ipc = require('electron-better-ipc');
const contextMenu = require('./renderer/contextMenu');
const theme = require('./renderer/theme');
const quill = require('./renderer/quill');
const editor = require('./renderer/editor');
const sidebar = require('./renderer/sidebar');
const footer = require('./renderer/footer');
const store = require('./renderer/store');
const find = require('./renderer/find');
const go = require('./renderer/goto');

const { app, dialog } = remote;

// Maintain an object with these modules
// for easy ipcRenderer access without eval()
const modules = {
  contextMenu,
  theme,
  quill,
  editor,
  sidebar,
  footer,
  store,
  find,
  go,
};

// Initialize the store with the window's project object
const { path } = remote.getCurrentWindow();
store.init(path);

// Spellcheck in texteditor
require('./renderer/spellcheck');

// Disable file drop redirect
require('electron-disable-file-drop');

// Catch unhandled promise rejections
require('electron-unhandled')();

// Init all the modules
theme.init();
quill.init();
editor.init();
sidebar.init();
contextMenu.init();
footer.init();

ipcRenderer.on('message', (e, d) => {
  const { method, module, parameters } = d;
  modules[module][method](parameters);
});

// Save editor contents
ipc.answerMain('save', async () => {
  editor.save();
  return true;
});

window.onbeforeunload = (e) => {
  const changes = store.get('changes');

  if (changes) {
    const choice = dialog.showMessageBox({
      type: 'question',
      buttons: ['Save', 'Cancel', 'Don\'t Save'],
      title: 'Confirm',
      message: `${store.get('path')} has changes, do you want to save them?`,
      detail: 'Your changes will be lost if you close this file without saving.',
      icon: `${app.image}`,
    });

    switch (choice) {
      case 0: {
        // Save
        editor.save();
        return;
      }
      case 1:
        // Cancel
        e.returnValue = false;
        break;
      case 2:
        // Don't Save
        store.set('changes', false);
        return;
      default:
        throw new Error(`Out of bounds dialog return: ${choice}`);
    }
  }
};
