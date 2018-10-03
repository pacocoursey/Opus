const { app, BrowserWindow } = require('electron');
const ipc = require('electron-better-ipc');
const path = require('path');
const home = require('os').homedir();
const fs = require('fs-extra');
const {
  quitApp,
  openWindow,
  getActiveWindows,
  closeIntroWindow,
  createIntroWindow,
  closeSplashWindow,
  createSplashWindow,
  createEditorWindow,
} = require('./helpers');

// Set app image path for dialogs
app.image = path.join(__dirname, '../assets/logo-no-shadow.png');

// Catch unhandled promise rejections
require('electron-unhandled')();

/**
 * Handle messages from renderer process.
 */

ipc.answerRenderer('openProject', async (p) => {
  const res = openWindow(p);

  if (res) closeSplashWindow();
});

ipc.answerRenderer('closeSplashWindow', async () => {
  closeSplashWindow();
});

ipc.answerRenderer('closeIntroWindow', async () => {
  await fs.ensureFile(path.join(home, '.opus'));
  closeIntroWindow();
  createSplashWindow();
});

/**
 * Create editor windows for each previosly active window.
 */

function createWindows(windows) {
  windows.forEach((win) => {
    createEditorWindow(win);
  });
}

app.on('ready', async () => {
  const isFirstRun = !await fs.pathExists(path.join(home, '.opus'));

  if (isFirstRun) {
    createIntroWindow();
  } else {
    const windows = getActiveWindows();

    if (windows.length === 0) {
      createSplashWindow();
    } else {
      createWindows(windows);
    }
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
  const allWindows = BrowserWindow.getAllWindows();

  if (allWindows.length === 0) {
    createSplashWindow();
  } else {
    allWindows[0].focus();
  }
});
