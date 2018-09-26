const { remote, shell } = require('electron');
const editor = require('./editor');
const theme = require('./theme');
const sidebar = require('./sidebar');
const quill = require('./quill');
const find = require('./find');
const goTo = require('./goto');

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
        role: 'quit',
        accelerator: 'CmdOrCtrl+q',
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
          editor.reset();
        },
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click() {
          // TODO: editor.open();
        },
      },
      { type: 'separator' },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        click() {
          editor.reset();
        },
      },
      {
        label: 'Save...',
        accelerator: 'CmdOrCtrl+S',
        click() {
          editor.save();
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
            click() { find.activate(false); },
          },
          {
            label: 'Find and Replace...',
            accelerator: 'CmdOrCtrl+Shift+F',
            click() { find.activate(true); },
          },
          {
            label: 'Replace All',
            click() { find.replaceAll(); },
          },
          {
            label: 'Find Next',
            accelerator: 'CmdOrCtrl+G',
            click() { find.find(1); },
          },
          {
            label: 'Find Previous',
            accelerator: 'CmdOrCtrl+Shift+G',
            click() { find.find(-1); },
          },
        ],
      },
      { type: 'separator' },
      {
        label: 'Go to Line',
        accelerator: 'CmdOrCtrl+Alt+G',
        click() { goTo.activate(); },
      },
    ],
  },
  {
    label: 'Format',
    submenu: [
      {
        label: 'Escape Current',
        accelerator: 'esc',
        click() { quill.escape(); },
      },
      { type: 'separator' },
      {
        label: 'Separator',
        accelerator: 'CmdOrCtrl+Shift+H',
        click() { quill.separator(); },
      },
      { type: 'separator' },
      {
        label: 'Heading 1',
        accelerator: 'CmdOrCtrl+1',
        click() { quill.h1(); },
      },
      {
        label: 'Heading 2',
        accelerator: 'CmdOrCtrl+2',
        click() { quill.h2(); },
      },
      {
        label: 'Heading 3',
        accelerator: 'CmdOrCtrl+3',
        click() { quill.h3(); },
      },
      { type: 'separator' },
      {
        label: 'Bold',
        accelerator: 'CmdOrCtrl+B',
        click() { quill.bold(); },
      },
      {
        label: 'Italic',
        accelerator: 'CmdOrCtrl+I',
        click() { quill.italic(); },
      },
      {
        label: 'Underline',
        accelerator: 'CmdOrCtrl+U',
        click() { quill.underline(); },
      },
      {
        label: 'Strikethrough',
        accelerator: 'CmdOrCtrl+Shift+S',
        click() { quill.strikethrough(); },
      },
      { type: 'separator' },
      {
        label: 'List',
        accelerator: 'CmdOrCtrl+L',
        click() { quill.list(); },
      },
      {
        label: 'Ordered List',
        accelerator: 'CmdOrCtrl+Shift+L',
        click() { quill.orderedList(); },
      },
      { type: 'separator' },
      {
        label: 'Quote',
        accelerator: 'CmdOrCtrl+.',
        click() { quill.quote(); },
      },
      {
        label: 'Code',
        accelerator: 'CmdOrCtrl+Shift+C',
        click() { quill.code(); },
      },
      {
        label: 'Codeblock',
        accelerator: 'CmdOrCtrl+Alt+C',
        click() { quill.codeblock(); },
      },
      { type: 'separator' },
      {
        label: 'Superscript',
        accelerator: 'CmdOrCtrl+Alt+Plus',
        click() { quill.superscript(); },
      },
      {
        label: 'Subscript',
        accelerator: 'CmdOrCtrl+Alt+-',
        click() { quill.subscript(); },
      },
      { type: 'separator' },
      {
        label: 'Indent',
        accelerator: 'CmdOrCtrl+]',
        click() { quill.indent(); },
      },
      {
        label: 'Outdent',
        accelerator: 'CmdOrCtrl+[',
        click() { quill.outdent(); },
      },
      {
        label: 'Clear Formatting',
        accelerator: 'CmdOrCtrl+0',
        click() { quill.clear(); },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Sidebar',
        accelerator: 'CmdOrCtrl+\\',
        click() { sidebar.toggle(); },
      },
      {
        label: 'Toggle Dark Mode',
        accelerator: 'CmdOrCtrl+D',
        click() { theme.toggle(); },
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
      { role: 'minimize' },
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

/**
 * Initialize the application menu
 */

function init() {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = {
  init,
  template,
};
