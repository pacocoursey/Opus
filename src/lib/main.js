const menu = require('./lib/menu.js');
const theme = require('./lib/theme.js');
const quill = require('./lib/quill.js');
const editor = require('./lib/editor.js');
const sidebar = require('./lib/sidebar.js');
const { ipcRenderer } = require('electron');

menu.init();
theme.init();
quill.init();
editor.init();
sidebar.init();

// TODO: sidebar right click menu (rename, delete, new file, new folder)

// TODO: Extras
// summon keybind
// :emoji: plugin

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
