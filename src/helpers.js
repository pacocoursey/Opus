const {
  app,
  shell,
  Menu,
  dialog,
  BrowserWindow,
} = require('electron');
const url = require('url');
const pathModule = require('path');
const settings = require('electron-settings');
const ipc = require('electron-better-ipc');
const Project = require('./project');

const template = [
  {
    label: 'Opus',
    submenu: [
      {
        label: 'About',
        click() { shell.openExternal('https://github.com/pacocoursey/Opus/'); },
      },
      {
        type: 'separator',
      },
      {
        label: 'Preferences',
        accelerator: 'CmdOrCtrl+,',
        click() {
          // TODO: preferences window
        },
      },
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
        label: 'Quit',
        accelerator: 'CmdOrCtrl+q',
        click() { module.exports.quitApp(); },
      },
    ],
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'New',
        accelerator: 'CmdOrCtrl+N',
        click() {
          module.exports.send('editor', 'reset');
        },
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click() { module.exports.openDialog(); },
      },
      { type: 'separator' },
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        click() {
          module.exports.send('editor', 'reset');
        },
      },
      {
        label: 'Save...',
        accelerator: 'CmdOrCtrl+S',
        click() {
          module.exports.send('editor', 'save');
        },
      },
      {
        label: 'Save As...',
        accelerator: 'CmdOrCtrl+Shift+S',
        click() {
          // TODO: editor.saveAs();
        },
      },
      // TODO: exports
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
            accelerator: 'CmdOrCtrl+F',
            click() { module.exports.send('find', 'activate', false); },
          },
          {
            label: 'Find and Replace...',
            accelerator: 'CmdOrCtrl+Shift+F',
            click() { module.exports.send('find', 'activate', true); },
          },
          {
            label: 'Replace All',
            click() { module.exports.send('find', 'replaceAll'); },
          },
          {
            label: 'Find Next',
            accelerator: 'CmdOrCtrl+G',
            click() { module.exports.send('find', 'find', 1); },
          },
          {
            label: 'Find Previous',
            accelerator: 'CmdOrCtrl+Shift+G',
            click() { module.exports.send('find', 'find', -1); },
          },
        ],
      },
      { type: 'separator' },
      {
        label: 'Go to Line',
        accelerator: 'CmdOrCtrl+Alt+G',
        click() { module.exports.send('goto', 'activate'); },
      },
    ],
  },
  {
    label: 'Format',
    submenu: [
      {
        label: 'Escape Current',
        accelerator: 'esc',
        click() { module.exports.send('quill', 'escape'); },
      },
      { type: 'separator' },
      {
        label: 'Separator',
        accelerator: 'CmdOrCtrl+Shift+H',
        click() { module.exports.send('quill', 'separator'); },
      },
      { type: 'separator' },
      {
        label: 'Heading 1',
        accelerator: 'CmdOrCtrl+1',
        click() { module.exports.send('quill', 'h1'); },
      },
      {
        label: 'Heading 2',
        accelerator: 'CmdOrCtrl+2',
        click() { module.exports.send('quill', 'h2'); },
      },
      {
        label: 'Heading 3',
        accelerator: 'CmdOrCtrl+3',
        click() { module.exports.send('quill', 'h3'); },
      },
      { type: 'separator' },
      {
        label: 'Bold',
        accelerator: 'CmdOrCtrl+B',
        click() { module.exports.send('quill', 'bold'); },
      },
      {
        label: 'Italic',
        accelerator: 'CmdOrCtrl+I',
        click() { module.exports.send('quill', 'italic'); },
      },
      {
        label: 'Underline',
        accelerator: 'CmdOrCtrl+U',
        click() { module.exports.send('quill', 'underline'); },
      },
      {
        label: 'Strikethrough',
        accelerator: 'CmdOrCtrl+Shift+S',
        click() { module.exports.send('quill', 'strikethrough'); },
      },
      { type: 'separator' },
      {
        label: 'List',
        accelerator: 'CmdOrCtrl+L',
        click() { module.exports.send('quill', 'list'); },
      },
      {
        label: 'Ordered List',
        accelerator: 'CmdOrCtrl+Shift+L',
        click() { module.exports.send('quill', 'orderedList'); },
      },
      { type: 'separator' },
      {
        label: 'Quote',
        accelerator: 'CmdOrCtrl+.',
        click() { module.exports.send('quill', 'quote'); },
      },
      {
        label: 'Code',
        accelerator: 'CmdOrCtrl+Shift+C',
        click() { module.exports.send('quill', 'code'); },
      },
      {
        label: 'Codeblock',
        accelerator: 'CmdOrCtrl+Alt+C',
        click() { module.exports.send('quill', 'codeblock'); },
      },
      { type: 'separator' },
      {
        label: 'Superscript',
        accelerator: 'CmdOrCtrl+Alt+Plus',
        click() { module.exports.send('quill', 'superscript'); },
      },
      {
        label: 'Subscript',
        accelerator: 'CmdOrCtrl+Alt+-',
        click() { module.exports.send('quill', 'subscript'); },
      },
      { type: 'separator' },
      {
        label: 'Indent',
        accelerator: 'CmdOrCtrl+]',
        click() { module.exports.send('quill', 'indent'); },
      },
      {
        label: 'Outdent',
        accelerator: 'CmdOrCtrl+[',
        click() { module.exports.send('quill', 'outdent'); },
      },
      {
        label: 'Clear Formatting',
        accelerator: 'CmdOrCtrl+0',
        click() { module.exports.send('quill', 'clear'); },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Sidebar',
        accelerator: 'CmdOrCtrl+\\',
        click() { module.exports.send('sidebar', 'toggle'); },
      },
      {
        label: 'Toggle Dark Mode',
        accelerator: 'CmdOrCtrl+D',
        click() { module.exports.send('theme', 'toggle'); },
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
        label: 'Close Window',
        accelerator: 'CmdOrCtrl+Shift+W',
        click() { module.exports.closeWindow(); },
      },
      { role: 'minimize' },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() { shell.openExternal('https://github.com/pacocoursey/Opus/'); },
      },
    ],
  },
];

const asyncForEach = async (array, callback) => {
  for (let i = 0; i < array.length; i += 1) {
    /* eslint-disable-next-line */
    await callback(array[i], i, array);
  }
};

module.exports = {
  openDialog() {
    const choice = dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
    });

    // Cancel was clicked, do nothing
    if (!choice || choice.length === 0) {
      return;
    }

    const path = choice[0];
    const p = new Project(path);

    // Ensure path is not already open as a window
    if (!global.projects[path]) {
      global.projects[path] = p;
      module.exports.windowCreation();
    }
  },
  windowCreation() {
    const projectArr = Object.values(global.projects);

    // Show open dialog if no active projects
    if (projectArr.length === 0) {
      console.log('Attempting to create open windwow.');
      let win = new BrowserWindow({
        width: 800,
        height: 450,
        resizable: false,
        // transparent: true,
        frame: false,
        show: false,
      });

      const { webContents } = win;
      webContents.on('did-finish-load', () => {
        webContents.setZoomFactor(1);
        webContents.setVisualZoomLevelLimits(1, 1);
        webContents.setLayoutZoomLevelLimits(0, 0);
      });

      webContents.on('new-window', (e) => {
        e.preventDefault();
      });

      win.loadURL(url.format({
        pathname: pathModule.join(__dirname, 'open.html'),
        protocol: 'file:',
        slashes: true,
      }));

      win.once('ready-to-show', () => {
        win.show();
      });

      win.on('closed', () => {
        win = null;
      });

      // console.log('No projects');
      // module.exports.openDialog();
    }

    // Loop through each project and open a window
    projectArr.forEach((project) => {
      // Only create if the window does not already exist
      if (!project.window) {
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
          pathname: pathModule.join(__dirname, 'index.html'),
          protocol: 'file:',
          slashes: true,
        }));

        project.window.once('ready-to-show', () => {
          project.window.show();
        });

        project.window.on('closed', () => {
          project.window = null;
        });
      }
    });
  },
  send(obj, func, params) {
    const win = BrowserWindow.getFocusedWindow();

    if (!win) {
      throw new Error('No focused window.');
    }

    const { webContents } = win;
    webContents.send('message', {
      module: obj,
      method: func,
      parameters: params,
    });
  },
  saveDialog() {
    const choice = dialog.showMessageBox({
      type: 'question',
      buttons: ['Save', 'Cancel', 'Don\'t Save'],
      title: 'Confirm',
      message: 'This file has changes, do you want to save them?',
      detail: 'Your changes will be lost if you close this item without saving.',
      icon: `${app.image}`,
    });

    return choice;
  },
  async closeWindow() {
    const win = BrowserWindow.getFocusedWindow();

    if (!win) {
      throw new Error('No focused window.');
    }

    const { path } = win.project;
    const { hasChanges } = global.projects[path];

    if (hasChanges) {
      const choice = module.exports.saveDialog();

      if (choice === 2) {
        // Don't Save
        win.close();
        delete global.projects[path];
      } else if (choice === 0) {
        // Save
        const ret = await ipc.callRenderer(win, 'save');
        if (ret) {
          win.close();
          delete global.projects[path];
        }
      }
    } else {
      win.close();
      delete global.projects[path];
    }
  },
  async quitApp() {
    let cancelFlag = false;
    const projectsArr = Object.values(global.projects);

    // If no windows are open, save settings then exit
    if (projectsArr.length === 0) {
      // Save the projects object to settings
      settings.set('projects', global.projects);
      app.exit();
      return;
    }

    await asyncForEach(projectsArr, async (project) => {
      if (project.window) {
        if (project.hasChanges) {
          project.window.focus();

          const choice = module.exports.saveDialog();

          if (choice === 2) {
            // Don't save
            project.window.close();
            project.hasChanges = false;
          } else if (choice === 1) {
            // Cancel
            cancelFlag = true;
          } else if (choice === 0) {
            // Save
            const ret = await ipc.callRenderer(project.window, 'save');
            if (ret) {
              project.window.close();
            }
          }
        } else {
          project.window.close();
        }
      }
    });

    if (cancelFlag) {
      return;
    }

    // Save the projects object to settings
    settings.set('projects', global.projects);

    // Should have closed all the windows by now
    app.exit();
  },
  menu() {
    const m = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(m);
  },
};
