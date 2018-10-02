const { app, dialog, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const ipc = require('electron-better-ipc');
const settings = require('electron-settings');
const windows = require('./windows');

let splashWindow;
let introWindow;

const editorWindowSettings = {
  width: 960,
  height: 544,
  minWidth: 500,
  minHeight: 400,
  frame: false,
  show: false,
  icon: app.image,
};

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
  // resizable: false,
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
    introWindow.show();
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

function createEditorWindow(win) {
  const w = new BrowserWindow(editorWindowSettings);

  // Pass along the respective path to each window
  w.path = win.path;

  // Set the window to active
  win.active = true;

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

  w.once('ready-to-show', () => {
    // Delay here to let animations (slide, theme) finish before showing
    setTimeout(() => {
      windows.get(win.path).show();
    }, 400);
  });

  w.on('closed', () => {
    win.active = false;
    settings.set(`windows.${win.path}`, win);
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

function openWindow(p) {
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
    createEditorWindow(obj);
  } else {
    const project = createNewProject(folderPath);
    createEditorWindow(project);
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

  if (windows.has(obj.path)) {
    windows.get(obj.path).close();
    windows.delete(obj.path);
  }

  obj.changes = false;

  // Don't set windows to inactive when we are quitting
  // we want these windows to re-appear on next launch
  if (!quitFlag) obj.active = false;
  settings.set(`windows.${obj.path}`, obj);

  if (windows.length() === 0) {
    createSplashWindow();
  }

  return true;
}

/**
 * Quit the application. Checks if any editor windows have changes,
 * requests to save changes, then closes all windows and updates
 * each window object to be inactive with a null window.
 */

async function quitApp() {
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

  app.exit();
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
