const {
  app, ipcMain, BrowserWindow, dialog,
} = require('electron');
const path = require('path');
const url = require('url');


app.image = path.join(__dirname, '../icon.png');
app.hasChanges = false;

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 960,
    height: 544,
    transparent: true,
    frame: false,
    show: false,
    center: true,
    icon: app.image,
    webPreferences: {
      experimentalFeatures: true,
    },
  });

  const { webContents } = win;
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1);
    webContents.setVisualZoomLevelLimits(1, 1);
    webContents.setLayoutZoomLevelLimits(0, 0);
  });

  webContents.on('new-window', (event) => {
    event.preventDefault();
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    win = null;
  });

  win.on('close', (e) => {
    e.preventDefault();

    if (app.hasChanges) {
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
        win.webContents.send('save');
      }
    } else {
      // Save the active file and tree state
      win.webContents.send('export');
    }
  });
}

ipcMain.on('done', () => {
  app.exit();
});

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
