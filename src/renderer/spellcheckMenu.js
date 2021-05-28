const { remote } = require('electron');
const store = require('./store');

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
    role: 'delete',
  }));

  menu.append(new MenuItem({
    role: 'selectall',
    accelerator: 'CmdOrCtrl+A',
  }));
};

const replace = (text) => {
  let selection;
  let range;

  if (window.getSelection()) {
    selection = window.getSelection();
    if (selection.rangeCount) {
      range = selection.getRangeAt(0);
      range.deleteContents();
      const node = document.createTextNode(text);
      range.insertNode(node);
      range.selectNodeContents(node);
    }
  }
};

const add = (text) => {
  window.spellChecker.add(text);
};

module.exports = (selection) => {
  const menu = new Menu();

  if (selection && selection.isMisspelled) {
    if (selection.suggestions.length === 0) {
      menu.append(new MenuItem({
        label: 'No Guesses Found',
        enabled: false,
      }));
    } else {
      selection.suggestions.forEach((suggestion) => {
        menu.append(new MenuItem({
          label: suggestion,
          click: () => {
            replace(suggestion);
          },
        }));
      });
    }

    menu.append(new MenuItem({ type: 'separator' }));

    // Add the word to the dictionary
    menu.append(new MenuItem({
      label: 'Learn Word',
      click: () => {
        add(selection.word);
      },
    }));
  }

  menu.append(new MenuItem({
    type: 'checkbox',
    label: 'SpellChecker',
    checked: store.get('spellcheck', true),
    click: (_, browserWindow) => {
      const { webContents } = browserWindow;
      webContents.send('message', {
        module: 'spellcheck',
        method: 'toggle',
      });
    },
  }));

  menu.append(new MenuItem({ type: 'separator' }));

  buildMenu(menu);
  return menu;
};
