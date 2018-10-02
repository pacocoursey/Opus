const { app, BrowserWindow } = require('electron');
const ipc = require('electron-better-ipc');
const path = require('path');
const home = require('os').homedir();
const fs = require('fs-extra');
const menu = require('./menu');
const {
  quitApp,
  openWindow,
  getActiveWindows,
  createIntroWindow,
  closeSplashWindow,
  createSplashWindow,
  createEditorWindow,
} = require('./helpers');

// Catch unhandled promise rejections
require('electron-unhandled')();

ipc.answerRenderer('openProject', async (p) => {
  const res = openWindow(p);
  menu.createEditorMenu();

  if (res) closeSplashWindow();
});

ipc.answerRenderer('closeSplashWindow', async () => {
  closeSplashWindow();
});

function createWindows(windows) {
  windows.forEach((win) => {
    createEditorWindow(win);
  });
}

app.on('ready', async () => {
  const isFirstRun = !await fs.pathExists(path.join(home, '.opus'));

  if (isFirstRun) {
    createIntroWindow();
    menu.createIntroMenu();
  } else {
    const windows = getActiveWindows();

    if (windows.length === 0) {
      createSplashWindow();
      menu.createSplashMenu();
    } else {
      createWindows(windows);
      menu.createEditorMenu();
    }

    // Set app image path for dialogs
    app.image = path.join(__dirname, '../icon.png');
  }
});

app.on('before-quit', (e) => {
  e.preventDefault();
  quitApp();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  const win = BrowserWindow.getFocusedWindow();

  if (!win) {
    createSplashWindow();
  } else {
    win.focus();
  }
});
