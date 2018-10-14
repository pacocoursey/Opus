/* eslint no-use-before-define: ["error", { "functions": false }] */

const {
  app,
  Menu,
  shell,
  dialog,
  BrowserWindow,
} = require('electron');
const url = require('url');
const path = require('path');
const ipc = require('electron-better-ipc');
const settings = require('electron-settings');
const windows = require('./windows');

let splashWindow;
let introWindow;

const splashWindowSettings = {
  width: 800,
  height: 450,
  resizable: false,
  frame: false,
  show: false,
  icon: app.image,
};

const introWindowSettings = {
  width: 800,
  height: 450,
  resizable: false,
  frame: false,
  show: false,
  icon: app.image,
};

/**
 * Close the intro BrowserWindow.
 */

function closeIntroWindow() {
  if (introWindow) {
    introWindow.close();
  }
}

/**
 * Create the intro BrowserWindow.
 */

function createIntroWindow() {
  // Set menu to intro menu.
  setIntroMenu();

  introWindow = new BrowserWindow(introWindowSettings);

  const { webContents } = introWindow;
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1);
    webContents.setVisualZoomLevelLimits(1, 1);
    webContents.setLayoutZoomLevelLimits(0, 0);
  });

  introWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/intro/intro.html'),
    protocol: 'file:',
    slashes: true,
  }));

  introWindow.once('ready-to-show', () => {
    setTimeout(() => {
      introWindow.show();
    }, 400);
  });

  introWindow.on('closed', () => {
    introWindow = null;
  });
}

/**
 * Close the splash BrowserWindow.
 */

function closeSplashWindow() {
  if (splashWindow) {
    splashWindow.close();
  }
}

/**
 * Create the splash BrowserWindow.
 */

function createSplashWindow() {
  // Set menu to intro menu.
  setSplashMenu();

  splashWindow = new BrowserWindow(splashWindowSettings);

  const { webContents } = splashWindow;
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1);
    webContents.setVisualZoomLevelLimits(1, 1);
    webContents.setLayoutZoomLevelLimits(0, 0);
  });

  splashWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/splash/splash.html'),
    protocol: 'file:',
    slashes: true,
  }));

  splashWindow.once('ready-to-show', () => {
    splashWindow.show();
  });

  splashWindow.on('closed', () => {
    splashWindow = null;
  });
}

/**
 * Create a new editor window and assign it to the settings object.
 */

async function createEditorWindow(win) {
  // Set menu to intro menu.
  setEditorMenu();

  const w = new BrowserWindow({
    x: settings.get(`windows.${win.path}.state.x`) || undefined,
    y: settings.get(`windows.${win.path}.state.y`) || undefined,
    width: settings.get(`windows.${win.path}.state.width`) || 960,
    height: settings.get(`windows.${win.path}.state.height`) || 544,
    minWidth: 500,
    minHeight: 400,
    titleBarStyle: 'hiddenInset',
    show: false,
    icon: app.image,
  });

  // Pass along the respective path to each window
  w.path = win.path;

  // Set the window to active
  win.active = true;

  // Update the last opened timestamp
  win.opened = Date.now();

  // Save the object to settings
  settings.set(`windows.${win.path}`, win);

  // Save the BrowserWindow reference
  windows.set(win.path, w);

  const { webContents } = w;
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1);
    webContents.setVisualZoomLevelLimits(1, 1);
    webContents.setLayoutZoomLevelLimits(0, 0);
  });

  w.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  w.on('closed', () => {
    windows.delete(win.path);
    if (windows.length() === 0) {
      createSplashWindow();
    }
  });

  ['resize', 'move'].forEach((e) => {
    w.on(e, () => {
      settings.set(`windows.${win.path}.state`, windows.get(win.path).getBounds());
    });
  });

  return new Promise((resolve) => {
    w.once('ready-to-show', () => {
      setTimeout(() => {
        windows.get(win.path).show();
        resolve();
      }, 400);
    });
  });
}

/**
 * Creates a new project object and adds it to settings.
 */

function createNewProject(projectPath) {
  if (settings.has(`windows.${projectPath}`)) {
    return settings.get(`windows.${projectPath}`);
  }

  const obj = {
    path: projectPath,
    file: undefined,
    tree: undefined,
    opened: undefined,
    active: false,
    footer: true,
    sidebar: true,
    dark: false,
    changes: false,
  };

  settings.set(`windows.${projectPath}`, obj);

  return obj;
}

/**
 * Opens an Open Dialog, allowing folders to be selected.
 * Returns the selected path or null.
 */

function openDialog() {
  const choice = dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
  });

  if (!choice || choice.length === 0 || !choice[0]) {
    return null;
  }

  return choice[0];
}

/**
 * Opens a new editor window.
 * takes a path as an argument, or opens a dialog to get a path
 */

async function openWindow(p) {
  let folderPath = p;

  if (!folderPath) {
    folderPath = openDialog();
  }

  if (!folderPath) {
    return false;
  }

  if (settings.has(`windows.${folderPath}`)) {
    // This path has been opened before
    // check if there exists a BrowserWindow for it
    if (windows.has(folderPath)) {
      // There is already a BrowserWindow, focus it
      windows.get(folderPath).focus();
      return false;
    }

    // The path is not currently open, open a new window
    const obj = settings.get(`windows.${folderPath}`);
    await createEditorWindow(obj);
  } else {
    const project = createNewProject(folderPath);
    await createEditorWindow(project);
  }

  return true;
}

/**
 * Close a specified window, or closes the focused window.
 * Does NOT check if window has changes, use closeEditorWindow() for that.
 * Does NOT update settings object.
 */

function closeWindow(win = BrowserWindow.getFocusedWindow()) {
  if (!win) throw new Error('No focused window.');
  else win.close();
}

/**
 * Returns an array of window objects that have active = true.
 */

function getActiveWindows() {
  if (!settings.has('windows')) {
    return [];
  }

  const wins = settings.get('windows');
  const active = Object.values(wins).filter(win => win.active);

  return active;
}

/**
 * Send a message to the focused window to trigger a renderer process function.
 */

function send(obj, func, params) {
  const win = BrowserWindow.getFocusedWindow();

  if (!win) throw new Error('No focused window.');

  const { webContents } = win;
  webContents.send('message', {
    module: obj,
    method: func,
    parameters: params,
  });
}

/**
 * Ask the user if they want to Save, Cancel, or Don't Save.
 * Returns the user's choice.
 */

function saveDialog(p) {
  return dialog.showMessageBox({
    type: 'question',
    buttons: ['Save', 'Cancel', 'Don\'t Save'],
    title: 'Confirm',
    message: `${p} has changes, do you want to save them?`,
    detail: 'Your changes will be lost if you close this file without saving.',
    icon: `${app.image}`,
  });
}

/**
 * Find the associated settings object with a BrowserWindow.
 */

function getWindowObject(win = BrowserWindow.getFocusedWindow()) {
  if (!win) throw new Error('Cannot get window object of null window.');

  const p = win.path;
  if (!settings.has(`windows.${p}`)) {
    throw new Error(`Cannot find window object for window ${win}`);
  }

  return settings.get(`windows.${p}`);
}

/**
 * Closes a window. If it has changes, ask user for input.
 * If it does not have changes it closes the window, updates win object.
 */

async function closeEditorWindow(win, quitFlag = false) {
  let obj = win;

  if (!win) {
    const window = BrowserWindow.getFocusedWindow();

    if (!window) throw new Error('No focused window.');

    // Get the associated window object
    obj = getWindowObject(window);
  }

  if (obj.changes) {
    windows.get(obj.path).focus();
    const choice = saveDialog(obj.path);
    switch (choice) {
      case 0: {
        // Save
        const ret = await ipc.callRenderer(windows.get(obj.path), 'save');
        if (!ret) throw new Error('Save called failed.');
        break;
      }
      case 1:
        // Cancel
        return false;
      case 2:
        // Don't Save
        break;
      default:
        throw new Error(`Out of bounds dialog return: ${choice}`);
    }
  }

  // A closed window cannot have changes
  obj.changes = false;

  // Don't set windows to inactive when we are quitting
  // we want these windows to re-appear on next launch
  if (!quitFlag) obj.active = false;
  settings.set(`windows.${obj.path}`, obj);

  return true;
}

/**
 * Quit the application. Checks if any editor windows have changes,
 * requests to save changes, then closes all windows and updates
 * each window object to be inactive with a null window.
 */

async function quitApp() {
  if (settings.has('windows')) {
    const nonChanged = Object.values(settings.get('windows')).filter(win => (win.active && !win.changes));
    const changed = Object.values(settings.get('windows')).filter(win => win.changes);

    // Loop through the changed windows first in case of cancel
    for (let i = 0; i < changed.length; i += 1) {
      /* eslint-disable-next-line */
      const ret = await closeEditorWindow(changed[i], true);

      // Either cancelled or some error thrown
      // do not continue closing windows and do not quit
      if (ret === false) {
        return;
      }
    }

    // Windows with changes have been handled, close the rest
    nonChanged.forEach((win) => {
      closeEditorWindow(win, true);
    });
  }

  app.exit();
}

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
        // {
        //   label: 'Preferences...',
        //   accelerator: 'CmdOrCtrl+,',
        //   click() {
        //     // TODO: preferences window
        //   },
        // },
        { type: 'separator' },
        { role: 'services', submenu: [] },
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
          role: 'quit',
          label: 'Quit Opus',
          accelerator: 'CmdOrCtrl+q',
          // click() { quitApp(); },
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
          async click() {
            // If called from splash window, send a message to show spinner
            if (BrowserWindow.getFocusedWindow() === splashWindow) {
              ipc.callRenderer(splashWindow, 'showSpinner');
            }

            const res = await openWindow();

            if (res) {
              closeSplashWindow();
            }
          },
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
        {
          label: 'Heading 4',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+4',
          click() { send('quill', 'h4'); },
        },
        {
          label: 'Heading 5',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+5',
          click() { send('quill', 'h5'); },
        },
        {
          label: 'Heading 6',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+6',
          click() { send('quill', 'h6'); },
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
          accelerator: 'CmdOrCtrl+Alt+=',
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
          enabled: isEnabled,
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
          role: 'close',
          label: 'Close Window',
          enabled: isEnabled,
          accelerator: 'CmdOrCtrl+Shift+W',
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

function setIntroMenu() {
  const template = buildMenu(false, false);
  const m = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(m);
}

/**
 * Build the splash menu and apply it.
 */

function setSplashMenu() {
  const template = buildMenu(false, true);
  const m = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(m);
}

/**
 * Build the editor menu and apply it.
 */

function setEditorMenu() {
  const template = buildMenu(true, true);
  const m = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(m);
}


module.exports = {
  send,
  quitApp,
  openWindow,
  closeWindow,
  getActiveWindows,
  closeIntroWindow,
  closeSplashWindow,
  createIntroWindow,
  closeEditorWindow,
  createSplashWindow,
  createEditorWindow,
};
