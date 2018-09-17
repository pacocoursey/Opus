const { app, BrowserWindow } = require('electron');
const path = require('path');
const settings = require('electron-settings');
const ipc = require('electron-better-ipc');
const Project = require('./project');
const helpers = require('./helpers');

app.image = path.join(__dirname, '../icon.png');

global.projects = {};

ipc.answerRenderer('openDialog', async () => helpers.openDialog());

ipc.answerRenderer('closeFocusedWindow', async () => {
  const win = BrowserWindow.getFocusedWindow();

  if (!win) {
    return false;
  }

  win.close();
  return true;
});

ipc.answerRenderer('openProject', async (p) => {
  const project = Project.new(p);

  // Ensure path is not already open as a window
  if (!global.projects[p]) {
    global.projects[p] = project;
    helpers.closeStartWindow();
    helpers.windowCreation();
  }
});

// Handle quitting ourselves
app.on('before-quit', (e) => {
  e.preventDefault();
  helpers.quitApp();
});

app.on('ready', () => {
  // TODO: start window etc..

  if (settings.has('projects')) {
    global.projects = settings.get('projects');
  } else {
    global.projects = {};
  }

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
