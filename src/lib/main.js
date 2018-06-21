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

ipcRenderer.on('save', (e) => {
  editor.save();
  e.sender.send('saved');
});

// TODO: electron-settings to remember editor state
// TODO: :emoji: plugin
