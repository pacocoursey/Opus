const { ipcRenderer } = require('electron');
const menu = require('./lib/menu');
const contextMenu = require('./lib/contextMenu');
const theme = require('./lib/theme');
const quill = require('./lib/quill');
const editor = require('./lib/editor');
const sidebar = require('./lib/sidebar');
const footer = require('./lib/footer');

// Spellcheck in texteditor
require('./lib/spellcheck');

// Disable file drop redirect
require('electron-disable-file-drop');

theme.init();
quill.init();
editor.init();
sidebar.init();
menu.init();
contextMenu.init();
footer.init();

// Save the state of active file and tree
ipcRenderer.on('export', (e) => {
  sidebar.export();
  e.sender.send('done');
});

// Save editor contents
// then save state of active file and tree
ipcRenderer.on('save', (e) => {
  editor.save();
  editor.export();
  sidebar.export();
  e.sender.send('done');
});
