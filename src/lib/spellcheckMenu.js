const { remote } = require('electron');

const {
  Menu, MenuItem,
} = remote;

const buildMenu = (menu) => {
  menu.append(new MenuItem({
    role: 'cut',
    accelerator: 'CmdOrCtrl+X',
  }));

  menu.append(new MenuItem({
    role: 'copy',
    accelerator: 'CmdOrCtrl+C',
  }));

  menu.append(new MenuItem({
    role: 'paste',
    accelerator: 'CmdOrCtrl+V',
  }));

  menu.append(new MenuItem({
    role: 'selectall',
    accelerator: 'CmdOrCtrl+A',
  }));

  menu.append(new MenuItem({ type: 'separator' }));

  menu.append(new MenuItem({
    label: 'Bold',
    accelerator: 'CmdOrCtrl+B',
    click: () => { console.log('bold'); },
  }));

  menu.append(new MenuItem({
    label: 'Italic',
    accelerator: 'CmdOrCtrl+I',
    click: () => { console.log('italic'); },
  }));

  menu.append(new MenuItem({
    label: 'Underline',
    accelerator: 'CmdOrCtrl+U',
    click: () => { console.log('underline'); },
  }));

  /* TODO: the rest... */
};

const replace = (text) => {
  let selection;
  let range;

  if (window.getSelection()) {
    selection = window.getSelection();
    if (selection.rangeCount) {
      range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    }
  }
};

module.exports = (selection) => {
  const menu = new Menu();

  if (selection.isMisspelled) {
    selection.suggestions.forEach((suggestion) => {
      menu.append(new MenuItem({
        label: suggestion,
        click: () => {
          replace(suggestion);
        },
      }));
    });

    menu.append(new MenuItem({ type: 'separator' }));
  }

  buildMenu(menu);
  return menu;
};
