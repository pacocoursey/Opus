const { remote, shell } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const editor = require('./editor.js');

const {
  Menu, MenuItem, dialog, app,
} = remote;
const win = remote.getCurrentWindow();
const folderMenu = new Menu();
const fileMenu = new Menu();
const rootMenu = new Menu();

let element;
let elementPath;

const parent = function getParentPath(p) {
  return path.dirname(p);
};

const removeActive = function removeActiveClassFromSidebar() {
  const elems = document.querySelectorAll('.selected');
  [].forEach.call(elems, (el) => {
    el.classList.remove('selected');
  });
};

const newFile = function createNewFile(p) {
  const choice = dialog.showSaveDialog({
    defaultPath: p,
  });

  if (choice && choice !== '') {
    fs.writeFile(choice, '', (error) => {
      if (error) { throw new Error(error); }
    });

    if (editor.get() === choice) { editor.open(choice); }
  }
};

const newFolder = function createNewFolder(p) {
  const choice = dialog.showSaveDialog({
    defaultPath: p,
  });

  if (choice && choice !== '') {
    const exists = fs.existsSync(choice);

    if (exists) { fs.removeSync(choice); }

    fs.ensureDir(choice, (error) => {
      if (error) { throw new Error(error); }
    });
  }
};

const rename = function renameFileOrFolder(p, isFile) {
  const choice = dialog.showSaveDialog({
    defaultPath: parent(p),
  });

  if (choice && choice !== '') {
    fs.rename(p, choice, (error) => {
      if (error) { throw new Error(error); }
    });

    if (isFile) {
      if (editor.get() === p) { editor.open(choice); }
    }
  }
};

const duplicate = function duplicateFileOrFolder(p) {
  const choice = dialog.showSaveDialog({
    defaultPath: parent(p),
  });

  if (choice && choice !== '') {
    fs.copy(p, choice, (error) => {
      if (error) { throw new Error(error); }
    });
  }
};

const del = function deleteFileOrFolder(p) {
  const choice = dialog.showMessageBox({
    type: 'warning',
    buttons: ['Delete', 'Cancel'],
    defaultId: 0,
    message: 'Are you sure you want to delete the selected item?',
    detail: `You are deleting: ${p}`,
    icon: `${app.image}`,
  });

  if (choice === 0) {
    fs.remove(p, (error) => {
      if (error) { throw new Error(error); }
    });
  }
};

const show = function showInFileManager(p) {
  if (!shell.showItemInFolder(p)) {
    throw new Error('Unable to show file in file manager.');
  }
};


function buildFolderMenu(m) {
  m.append(new MenuItem({
    label: 'New File',
    click: () => { newFile(elementPath); },
  }));

  m.append(new MenuItem({
    label: 'New Folder',
    click: () => { newFolder(elementPath); },
  }));

  m.append(new MenuItem({
    type: 'separator',
  }));

  m.append(new MenuItem({
    label: 'Rename',
    click: () => { rename(elementPath); },
  }));

  m.append(new MenuItem({
    label: 'Duplicate',
    click: () => { duplicate(elementPath); },
  }));

  m.append(new MenuItem({
    label: 'Delete',
    click: () => { del(elementPath); },
  }));

  m.append(new MenuItem({
    type: 'separator',
  }));

  m.append(new MenuItem({
    label: 'Show in Finder',
    click: () => { show(elementPath); },
  }));

  m.on('menu-will-close', () => {
    removeActive();
  });
}

function buildFileMenu(m) {
  m.append(new MenuItem({
    label: 'Rename',
    click: () => { rename(elementPath, true); },
  }));

  m.append(new MenuItem({
    label: 'Duplicate',
    click: () => { duplicate(elementPath); },
  }));

  m.append(new MenuItem({
    label: 'Delete',
    click: () => { del(elementPath); },
  }));

  m.append(new MenuItem({
    type: 'separator',
  }));

  m.append(new MenuItem({
    label: 'Show in Finder',
    click: () => { show(elementPath); },
  }));

  m.on('menu-will-close', () => {
    removeActive();
  });
}

function buildRootMenu(m) {
  m.append(new MenuItem({
    label: 'New File',
    click: () => { newFile(elementPath); },
  }));

  m.append(new MenuItem({
    label: 'New Folder',
    click: () => { newFolder(elementPath); },
  }));

  m.append(new MenuItem({
    type: 'separator',
  }));

  m.append(new MenuItem({
    label: 'Show in Finder',
    click: () => { show(elementPath); },
  }));

  m.on('menu-will-close', () => {
    removeActive();
  });
}

module.exports = {
  init() {
    buildFileMenu(fileMenu);
    buildFolderMenu(folderMenu);
    buildRootMenu(rootMenu);

    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      element = e.target.closest('.tree-leaf-content');

      if (element) {
        const data = JSON.parse(element.getAttribute('data-item'));
        const { type, root } = data;
        elementPath = data.path;

        if (root) {
          rootMenu.popup(win);
        } else if (type === 'directory') {
          folderMenu.popup(win);
        } else {
          fileMenu.popup(win);
        }
        element.classList.add('selected');
      }
    }, false);
  },
};
