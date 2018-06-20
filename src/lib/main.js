const menu = require('./lib/menu.js');
const theme = require('./lib/theme.js');
const quill = require('./lib/quill.js');
const editor = require('./lib/editor.js');
const sidebar = require('./lib/sidebar.js');

menu.init();
theme.init();
quill.init();
editor.init();
sidebar.init();

// TODO: electron-settings to remember editor state
// TODO: re-write my own tree-view module
// TODO: :emoji: plugin
