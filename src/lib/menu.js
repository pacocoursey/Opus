const { remote, shell } = require('electron');
const editor = require('./editor.js');
const theme = require('./theme.js');
const themes = require('./themes/themes.js');

const { Menu } = remote;
const sidebar = document.querySelector('aside');

const template = [
  {
    label: 'Opus',
    submenu: [
      {
        label: 'About',
        click() { shell.openExternal('https://github.com/pacocoursey/Opus/'); },
      },
      {
        type: 'separator',
      },
      {
        label: 'Preferences',
        accelerator: 'CmdOrCtrl+,',
        click() {},
      },
      { type: 'separator' },
      {
        label: 'Hide Opus',
        role: 'hide',
        accelerator: 'CmdOrCtrl+h',
      },
      {
        label: 'Hide Others',
        role: 'hideothers',
        accelerator: 'CmdOrCtrl+Option+h',
      },
      { type: 'separator' },
      {
        label: 'Quit',
        role: 'quit',
        accelerator: 'CmdOrCtrl+q',
      },
    ],
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click() {
          editor.save();
        },
      },
      {
        label: 'Save as',
        accelerator: 'CmdOrCtrl+Shift+S',
        click() {
          editor.saveAs();
        },
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click() {
          editor.open();
        },
      },
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click() {
          editor.reset();
        },
      },
    ],
  },
  {
    label: 'Export',
    submenu: [
      {
        label: 'Export HTML',
        // accelerator: ,
        click() {
          // emitter.emit('export-html');
        },
      },
      {
        label: 'Export PDF',
        // accelerator: ,
        click() {
          // emitter.emit('export-pdf');
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Sidebar',
        accelerator: 'CmdOrCtrl+\\',
        click() {
          if (sidebar.style.display === 'block') {
            sidebar.style.display = 'none';
          } else {
            sidebar.style.display = 'block';
          }
        },
      },
      { type: 'separator' },
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    label: 'Theme',
    submenu: [
      {
        label: 'Apollo11',
        click() { theme.load(themes.get('Apollo11')); },
      },
      {
        label: 'Coal',
        click() { theme.load(themes.get('Coal')); },
      },
      {
        label: 'Lotus',
        click() { theme.load(themes.get('Lotus')); },
      },
      {
        label: 'Raspberry',
        click() { theme.load(themes.get('Raspberry')); },
      },
      {
        label: 'Swiss',
        click() { theme.load(themes.get('Swiss')); },
      },
    ],
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      {
        label: 'Close Window',
        accelerator: 'CmdOrCtrl+W',
        click() {
          editor.reset();
        },
      },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() { shell.openExternal('https://github.com/pacocoursey/Opus/'); },
      },
    ],
  },
];

module.exports = {
  init() {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  },
};
