const { app, BrowserWindow } = require('electron');
const path = require('path');
const settings = require('electron-settings');
const helpers = require('./helpers');

app.image = path.join(__dirname, '../icon.png');

if (settings.has('projects')) {
  global.projects = settings.get('projects');
  Object.values(global.projects).forEach((p) => { delete p.window; });
} else {
  global.projects = {};
}

// Handle quitting ourselves
app.on('before-quit', (e) => {
  e.preventDefault();
  helpers.quitApp();
});

app.on('ready', () => {
  // TODO: start window etc..
  // Initialize the windows
  helpers.windowCreation();

  // Configure application menu
  helpers.menu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  const win = BrowserWindow.getFocusedWindow();

  // Focus a window if there are any
  // if not, show open window
  if (!win) {
    helpers.windowCreation();
  } else {
    win.focus();
  }
});
