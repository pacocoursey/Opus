const { app, BrowserWindow } = require('electron');
const ipc = require('electron-better-ipc');
const path = require('path');
const home = require('os').homedir();
const fs = require('fs-extra');
const {
  openWindow,
  getActiveWindows,
  closeIntroWindow,
  createIntroWindow,
  closeSplashWindow,
  createSplashWindow,
  createEditorWindow,
} = require('./helpers');

// Set app image path for dialogs
app.image = path.join(__dirname, '../assets/icon.png');

// Catch unhandled promise rejections
require('electron-unhandled')();

/**
 * Handle messages from renderer process.
 */

ipc.answerRenderer('openProject', async (p) => {
  const res = await openWindow(p);
  if (res) closeSplashWindow();
  return res;
});

ipc.answerRenderer('closeSplashWindow', async () => {
  closeSplashWindow();
});

ipc.answerRenderer('closeIntroWindow', async () => {
  await fs.ensureFile(path.join(home, '.opus'));
  app.isFirstRun = false;
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
  app.isFirstRun = !await fs.pathExists(path.join(home, '.opus'));

  if (app.isFirstRun) {
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

app.on('window-all-closed', (e) => {
  e.preventDefault();
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();

  if (app.isFirstRun) {
    createIntroWindow();
  } else if (allWindows.length === 0) {
    createSplashWindow();
  } else {
    allWindows[0].focus();
  }
});
