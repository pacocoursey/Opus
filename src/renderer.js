const { remote, ipcRenderer } = require('electron');
const ipc = require('electron-better-ipc');
const contextMenu = require('./lib/contextMenu');
const theme = require('./lib/theme');
const quill = require('./lib/quill');
const editor = require('./lib/editor');
const sidebar = require('./lib/sidebar');
const footer = require('./lib/footer');
const store = require('./lib/store');

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
};

// Initialize the store with the window's project object
const { project } = remote.getCurrentWindow();
store.path(project.path);

// Spellcheck in texteditor
require('./lib/spellcheck');

// Disable file drop redirect
require('electron-disable-file-drop');

// Init all the modules
theme.init();
quill.init();
editor.init();
sidebar.init();
contextMenu.init();
footer.init();

ipcRenderer.on('message', (e, d) => {
  const { method, module, params } = d;
  modules[module][method](params);
});

// Save editor contents
ipc.answerMain('save', async () => {
  editor.save();
  return true;
});
