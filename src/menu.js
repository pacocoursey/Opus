const { shell, Menu } = require('electron');
const {
  send,
  quitApp,
  openWindow,
  closeEditorWindow,
  closeSplashWindow,
} = require('./helpers');

function buildMenu(enabled = true, specialCase = true) {
  return [
    {
      label: 'Opus',
      submenu: [
        {
          label: 'About Opus',
          click() { shell.openExternal('https://github.com/pacocoursey/Opus/'); },
        },
        {
          type: 'separator',
        },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click() {
            // TODO: preferences window
          },
        },
        { type: 'separator' },
        { role: 'services' },
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
          label: 'Quit Opus',
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
          enabled,
          accelerator: 'CmdOrCtrl+N',
          click() {
            send('editor', 'reset');
          },
        },
        {
          label: 'Open',
          enabled: specialCase,
          accelerator: 'CmdOrCtrl+O',
          click() { openWindow(); closeSplashWindow(); },
        },
        { type: 'separator' },
        {
          label: 'Close',
          enabled,
          accelerator: 'CmdOrCtrl+W',
          click() {
            send('editor', 'reset');
          },
        },
        {
          label: 'Save...',
          enabled,
          accelerator: 'CmdOrCtrl+S',
          click() {
            send('editor', 'save');
          },
        },
        { type: 'separator' },
        {
          label: 'Export To',
          submenu: [
            {
              label: 'HTML...',
              enabled,
              click() { send('editor', 'exportEditor', 'html'); },
            },
            {
              label: 'Markdown...',
              enabled,
              click() { send('editor', 'exportEditor', 'md'); },
            },
            {
              label: 'Plain Text...',
              enabled,
              click() { send('editor', 'exportEditor', 'txt'); },
            },
          ],
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
              enabled,
              accelerator: 'CmdOrCtrl+F',
              click() { send('find', 'activate', false); },
            },
            {
              label: 'Find and Replace...',
              enabled,
              accelerator: 'CmdOrCtrl+Shift+F',
              click() { send('find', 'activate', true); },
            },
            {
              label: 'Replace All',
              enabled,
              click() { send('find', 'replaceAll'); },
            },
            {
              label: 'Find Next',
              enabled,
              accelerator: 'CmdOrCtrl+G',
              click() { send('find', 'find', 1); },
            },
            {
              label: 'Find Previous',
              enabled,
              accelerator: 'CmdOrCtrl+Shift+G',
              click() { send('find', 'find', -1); },
            },
          ],
        },
        { type: 'separator' },
        {
          label: 'Go to Line',
          enabled,
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
          enabled,
          accelerator: 'esc',
          click() { send('quill', 'escape'); },
        },
        { type: 'separator' },
        {
          label: 'Separator',
          enabled,
          accelerator: 'CmdOrCtrl+Shift+H',
          click() { send('quill', 'separator'); },
        },
        { type: 'separator' },
        {
          label: 'Heading 1',
          enabled,
          accelerator: 'CmdOrCtrl+1',
          click() { send('quill', 'h1'); },
        },
        {
          label: 'Heading 2',
          enabled,
          accelerator: 'CmdOrCtrl+2',
          click() { send('quill', 'h2'); },
        },
        {
          label: 'Heading 3',
          enabled,
          accelerator: 'CmdOrCtrl+3',
          click() { send('quill', 'h3'); },
        },
        { type: 'separator' },
        {
          label: 'Bold',
          enabled,
          accelerator: 'CmdOrCtrl+B',
          click() { send('quill', 'bold'); },
        },
        {
          label: 'Italic',
          enabled,
          accelerator: 'CmdOrCtrl+I',
          click() { send('quill', 'italic'); },
        },
        {
          label: 'Underline',
          enabled,
          accelerator: 'CmdOrCtrl+U',
          click() { send('quill', 'underline'); },
        },
        {
          label: 'Strikethrough',
          enabled,
          accelerator: 'CmdOrCtrl+Shift+S',
          click() { send('quill', 'strikethrough'); },
        },
        { type: 'separator' },
        {
          label: 'List',
          enabled,
          accelerator: 'CmdOrCtrl+L',
          click() { send('quill', 'list'); },
        },
        {
          label: 'Ordered List',
          enabled,
          accelerator: 'CmdOrCtrl+Shift+L',
          click() { send('quill', 'orderedList'); },
        },
        { type: 'separator' },
        {
          label: 'Quote',
          enabled,
          accelerator: 'CmdOrCtrl+.',
          click() { send('quill', 'quote'); },
        },
        {
          label: 'Code',
          enabled,
          accelerator: 'CmdOrCtrl+Shift+C',
          click() { send('quill', 'code'); },
        },
        {
          label: 'Codeblock',
          enabled,
          accelerator: 'CmdOrCtrl+Alt+C',
          click() { send('quill', 'codeblock'); },
        },
        { type: 'separator' },
        {
          label: 'Superscript',
          enabled,
          accelerator: 'CmdOrCtrl+Alt+Plus',
          click() { send('quill', 'superscript'); },
        },
        {
          label: 'Subscript',
          enabled,
          accelerator: 'CmdOrCtrl+Alt+-',
          click() { send('quill', 'subscript'); },
        },
        { type: 'separator' },
        {
          label: 'Indent',
          enabled,
          accelerator: 'CmdOrCtrl+]',
          click() { send('quill', 'indent'); },
        },
        {
          label: 'Outdent',
          enabled,
          accelerator: 'CmdOrCtrl+[',
          click() { send('quill', 'outdent'); },
        },
        {
          label: 'Clear Formatting',
          enabled,
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
          enabled,
          accelerator: 'CmdOrCtrl+\\',
          click() { send('sidebar', 'toggle'); },
        },
        {
          label: 'Toggle Dark Mode',
          accelerator: 'CmdOrCtrl+D',
          click() { send('theme', 'toggle'); },
        },
        {
          label: 'Toggle Footer',
          enabled,
          accelerator: 'Cmd+Alt+F',
          click() { send('footer', 'toggle'); },
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
          enabled,
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
}

/**
 * Build the introductory menu and apply it.
 */

function createIntroMenu() {
  const template = buildMenu(false, false);
  const m = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(m);
}

/**
 * Build the splash menu and apply it.
 */

function createSplashMenu() {
  const template = buildMenu(false);
  const m = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(m);
}

/**
 * Build the editor menu and apply it.
 */

function createEditorMenu() {
  const template = buildMenu(true);
  const m = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(m);
}

module.exports = {
  createIntroMenu,
  createSplashMenu,
  createEditorMenu,
};
