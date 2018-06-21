const { remote, shell } = require('electron');
const editor = require('./editor.js');

const { Menu } = remote;

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
        // click() {
        //   console.log('quit');
        // },
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
          editor.new();
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
          const sidebar = document.getElementsByClassName('sidebar')[0].parentElement;
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
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' },
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
