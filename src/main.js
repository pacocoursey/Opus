const { app, BrowserWindow } = require('electron');
const ipc = require('electron-better-ipc');
const path = require('path');
const menu = require('./menu');
const {
  quitApp,
  openWindow,
  getActiveWindows,
  closeSplashWindow,
  createSplashWindow,
  createEditorWindow,
} = require('./helpers');

// Catch unhandled promise rejections
require('electron-unhandled')();

ipc.answerRenderer('openProject', async (p) => {
  const res = openWindow(p);

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

app.on('ready', () => {
  const windows = getActiveWindows();

  if (windows.length === 0) {
    createSplashWindow();
  } else {
    createWindows(windows);
  }

  // Set app image path for dialogs
  app.image = path.join(__dirname, '../icon.png');

  menu.createMenu();
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
