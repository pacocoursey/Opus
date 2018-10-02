const { app, shell, Menu } = require('electron');
const {
  send,
  quitApp,
  openWindow,
  closeEditorWindow,
  closeSplashWindow,
} = require('./helpers');

function buildMenu(isEnabled = true, isOpenEnabled = true) {
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
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+N',
          click() {
            send('editor', 'reset');
          },
        },
        {
          label: 'Open',
          enabled: isOpenEnabled,
          accelerator: 'CmdOrCtrl+O',
          click() { openWindow(); closeSplashWindow(); },
        },
        { type: 'separator' },
        {
          label: 'Close',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+W',
          click() {
            send('editor', 'reset');
          },
        },
        {
          label: 'Save...',
          enabled: isEnabled,
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
              enabled: isEnabled,
              click() { send('editor', 'exportEditor', 'html'); },
            },
            {
              label: 'Markdown...',
              enabled: isEnabled,
              click() { send('editor', 'exportEditor', 'md'); },
            },
            {
              label: 'Plain Text...',
              enabled: isEnabled,
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
              enabled: isEnabled,
              accelerator: 'CmdOrCtrl+F',
              click() { send('find', 'activate', false); },
            },
            {
              label: 'Find and Replace...',
              enabled: isEnabled,
              accelerator: 'CmdOrCtrl+Shift+F',
              click() { send('find', 'activate', true); },
            },
            {
              label: 'Replace All',
              enabled: isEnabled,
              click() { send('find', 'replaceAll'); },
            },
            {
              label: 'Find Next',
              enabled: isEnabled,
              accelerator: 'CmdOrCtrl+G',
              click() { send('find', 'find', 1); },
            },
            {
              label: 'Find Previous',
              enabled: isEnabled,
              accelerator: 'CmdOrCtrl+Shift+G',
              click() { send('find', 'find', -1); },
            },
          ],
        },
        { type: 'separator' },
        {
          label: 'Go to Line',
          enabled: isEnabled,
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
          enabled: isEnabled,
          accelerator: 'esc',
          click() { send('quill', 'escape'); },
        },
        { type: 'separator' },
        {
          label: 'Separator',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+Shift+H',
          click() { send('quill', 'separator'); },
        },
        { type: 'separator' },
        {
          label: 'Heading 1',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+1',
          click() { send('quill', 'h1'); },
        },
        {
          label: 'Heading 2',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+2',
          click() { send('quill', 'h2'); },
        },
        {
          label: 'Heading 3',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+3',
          click() { send('quill', 'h3'); },
        },
        { type: 'separator' },
        {
          label: 'Bold',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+B',
          click() { send('quill', 'bold'); },
        },
        {
          label: 'Italic',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+I',
          click() { send('quill', 'italic'); },
        },
        {
          label: 'Underline',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+U',
          click() { send('quill', 'underline'); },
        },
        {
          label: 'Strikethrough',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+Shift+S',
          click() { send('quill', 'strikethrough'); },
        },
        { type: 'separator' },
        {
          label: 'List',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+L',
          click() { send('quill', 'list'); },
        },
        {
          label: 'Ordered List',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+Shift+L',
          click() { send('quill', 'orderedList'); },
        },
        { type: 'separator' },
        {
          label: 'Quote',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+.',
          click() { send('quill', 'quote'); },
        },
        {
          label: 'Code',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+Shift+C',
          click() { send('quill', 'code'); },
        },
        {
          label: 'Codeblock',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+Alt+C',
          click() { send('quill', 'codeblock'); },
        },
        { type: 'separator' },
        {
          label: 'Superscript',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+Alt+Plus',
          click() { send('quill', 'superscript'); },
        },
        {
          label: 'Subscript',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+Alt+-',
          click() { send('quill', 'subscript'); },
        },
        { type: 'separator' },
        {
          label: 'Indent',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+]',
          click() { send('quill', 'indent'); },
        },
        {
          label: 'Outdent',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+[',
          click() { send('quill', 'outdent'); },
        },
        {
          label: 'Clear Formatting',
          enabled: isEnabled,
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
          enabled: isEnabled,
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
          enabled: isEnabled,
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
          enabled: isEnabled,
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
  const template = buildMenu(false, true);
  const m = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(m);
}

/**
 * Build the editor menu and apply it.
 */

function createEditorMenu() {
  const template = buildMenu(true, true);
  const m = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(m);
}

module.exports = {
  createIntroMenu,
  createSplashMenu,
  createEditorMenu,
};
