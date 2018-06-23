const menu = require('./lib/menu.js');
const contextMenu = require('./lib/contextMenu.js');
const theme = require('./lib/theme.js');
const quill = require('./lib/quill.js');
const editor = require('./lib/editor.js');
const sidebar = require('./lib/sidebar.js');
const { ipcRenderer } = require('electron');

quill.init();
editor.init();
menu.init();
theme.init();
sidebar.init();
contextMenu.init();

// Save the state of active file and tree
ipcRenderer.on('export', (e) => {
  editor.export();
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
