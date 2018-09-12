const {
  app,
  dialog,
  ipcMain,
  BrowserWindow,
} = require('electron');
const url = require('url');
const path = require('path');
const Project = require('./project');
const menu = require('./menu');

app.image = path.join(__dirname, '../icon.png');

const projects = {};
const p1 = new Project('/Users/paco/Dropbox/school/Opus');
const p2 = new Project('/Users/paco/Dropbox/school/Opus2');

projects[p1.path] = p1;
projects[p2.path] = p2;

function windowCreation() {
  // TODO: error check if projects is length 0, open a new window that
  // prompts user to open a working directory

  // Loop through each project and open a window
  Object.values(projects).forEach((project) => {
    project.window = new BrowserWindow({
      width: 960,
      height: 544,
      minWidth: 500,
      minHeight: 400,
      transparent: true,
      frame: false,
      show: false,
      center: true,
      icon: app.image,
    });

    // Send project information to the window
    project.window.project = {
      path: project.path,
      hasChanges: project.hasChanges,
      isSlid: project.isSlid,
      activeFile: project.activeFile,
      tree: project.tree,
    };

    const { webContents } = project.window;
    webContents.on('did-finish-load', () => {
      webContents.setZoomFactor(1);
      webContents.setVisualZoomLevelLimits(1, 1);
      webContents.setLayoutZoomLevelLimits(0, 0);
    });

    webContents.on('new-window', (e) => {
      e.preventDefault();
    });

    project.window.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    }));

    project.window.once('ready-to-show', () => {
      project.window.show();
    });

    project.window.on('closed', () => {
      project.window = null;
    });

    project.window.on('close', (e) => {
      console.log('Close event fired.');
      e.preventDefault();

      if (project.hasChanges) {
        const choice = dialog.showMessageBox({
          type: 'question',
          buttons: ['Save', 'Cancel', 'Don\'t Save'],
          title: 'Confirm',
          message: 'This file has changes, do you want to save them?',
          detail: 'Your changes will be lost if you close this item without saving.',
          icon: `${app.image}`,
        });

        if (choice === 2) {
          // Don't Save
          app.exit();
        } else if (choice === 0) {
          // Save
          project.window.webContents.send('save');
        }
      } else {
        // Save the active file and tree state
        webContents.send('export');
      }
    });
  });
}

ipcMain.on('done', () => {
  app.exit();
});

app.on('ready', () => {
  // TODO: start window etc..
  // Initialize the windows
  windowCreation();

  // Configure application menu
  menu.init();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('Activate the window?');
});
