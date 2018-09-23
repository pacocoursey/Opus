const { shell, Menu } = require('electron');
const {
  send,
  quitApp,
  openWindow,
  closeEditorWindow,
} = require('./helpers');

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
        click() {
          // TODO: preferences window
        },
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
        accelerator: 'CmdOrCtrl+q',
        click() { quitApp(); },
      },
    ],
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click() {
          send('editor', 'reset');
        },
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click() { openWindow(); },
      },
      { type: 'separator' },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        click() {
          send('editor', 'reset');
        },
      },
      {
        label: 'Save...',
        accelerator: 'CmdOrCtrl+S',
        click() {
          send('editor', 'save');
        },
      },
      {
        label: 'Save As...',
        accelerator: 'CmdOrCtrl+Shift+S',
        click() {
          // TODO: editor.saveAs();
        },
      },
      // TODO: exports
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
      {
        label: 'Paste',
        role: 'pasteandmatchstyle',
        accelerator: 'CmdOrCtrl+V',
      },
      {
        label: 'Paste with Style',
        role: 'paste',
        accelerator: 'CmdOrCtrl+Shift+V',
      },
      { role: 'delete' },
      { role: 'selectall' },
      { type: 'separator' },
      {
        label: 'Find',
        submenu: [
          {
            label: 'Find...',
            accelerator: 'CmdOrCtrl+F',
            click() { send('find', 'activate', false); },
          },
          {
            label: 'Find and Replace...',
            accelerator: 'CmdOrCtrl+Shift+F',
            click() { send('find', 'activate', true); },
          },
          {
            label: 'Replace All',
            click() { send('find', 'replaceAll'); },
          },
          {
            label: 'Find Next',
            accelerator: 'CmdOrCtrl+G',
            click() { send('find', 'find', 1); },
          },
          {
            label: 'Find Previous',
            accelerator: 'CmdOrCtrl+Shift+G',
            click() { send('find', 'find', -1); },
          },
        ],
      },
      { type: 'separator' },
      {
        label: 'Go to Line',
        accelerator: 'CmdOrCtrl+Alt+G',
        click() { send('go', 'activate'); },
      },
    ],
  },
  {
    label: 'Format',
    submenu: [
      {
        label: 'Escape Current',
        accelerator: 'esc',
        click() { send('quill', 'escape'); },
      },
      { type: 'separator' },
      {
        label: 'Separator',
        accelerator: 'CmdOrCtrl+Shift+H',
        click() { send('quill', 'separator'); },
      },
      { type: 'separator' },
      {
        label: 'Heading 1',
        accelerator: 'CmdOrCtrl+1',
        click() { send('quill', 'h1'); },
      },
      {
        label: 'Heading 2',
        accelerator: 'CmdOrCtrl+2',
        click() { send('quill', 'h2'); },
      },
      {
        label: 'Heading 3',
        accelerator: 'CmdOrCtrl+3',
        click() { send('quill', 'h3'); },
      },
      { type: 'separator' },
      {
        label: 'Bold',
        accelerator: 'CmdOrCtrl+B',
        click() { send('quill', 'bold'); },
      },
      {
        label: 'Italic',
        accelerator: 'CmdOrCtrl+I',
        click() { send('quill', 'italic'); },
      },
      {
        label: 'Underline',
        accelerator: 'CmdOrCtrl+U',
        click() { send('quill', 'underline'); },
      },
      {
        label: 'Strikethrough',
        accelerator: 'CmdOrCtrl+Shift+S',
        click() { send('quill', 'strikethrough'); },
      },
      { type: 'separator' },
      {
        label: 'List',
        accelerator: 'CmdOrCtrl+L',
        click() { send('quill', 'list'); },
      },
      {
        label: 'Ordered List',
        accelerator: 'CmdOrCtrl+Shift+L',
        click() { send('quill', 'orderedList'); },
      },
      { type: 'separator' },
      {
        label: 'Quote',
        accelerator: 'CmdOrCtrl+.',
        click() { send('quill', 'quote'); },
      },
      {
        label: 'Code',
        accelerator: 'CmdOrCtrl+Shift+C',
        click() { send('quill', 'code'); },
      },
      {
        label: 'Codeblock',
        accelerator: 'CmdOrCtrl+Alt+C',
        click() { send('quill', 'codeblock'); },
      },
      { type: 'separator' },
      {
        label: 'Superscript',
        accelerator: 'CmdOrCtrl+Alt+Plus',
        click() { send('quill', 'superscript'); },
      },
      {
        label: 'Subscript',
        accelerator: 'CmdOrCtrl+Alt+-',
        click() { send('quill', 'subscript'); },
      },
      { type: 'separator' },
      {
        label: 'Indent',
        accelerator: 'CmdOrCtrl+]',
        click() { send('quill', 'indent'); },
      },
      {
        label: 'Outdent',
        accelerator: 'CmdOrCtrl+[',
        click() { send('quill', 'outdent'); },
      },
      {
        label: 'Clear Formatting',
        accelerator: 'CmdOrCtrl+0',
        click() { send('quill', 'clear'); },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Sidebar',
        accelerator: 'CmdOrCtrl+\\',
        click() { send('sidebar', 'toggle'); },
      },
      {
        label: 'Toggle Dark Mode',
        accelerator: 'CmdOrCtrl+D',
        click() { send('theme', 'toggle'); },
      },
      { type: 'separator' },
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { type: 'separator' },
      {
        role: 'togglefullscreen',
        accelerator: 'CmdOrCtrl+Shift+F',
      },
    ],
  },
  {
    role: 'window',
    submenu: [
      {
        label: 'Close Window',
        accelerator: 'CmdOrCtrl+Shift+W',
        click() { closeEditorWindow(); },
      },
      { role: 'minimize' },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() { shell.openExternal('https://github.com/pacocoursey/Opus'); },
      },
    ],
  },
];


function createMenu() {
  const m = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(m);
}

module.exports = { createMenu };
