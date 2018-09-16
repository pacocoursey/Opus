const { app, dialog } = require('electron').remote;
const Delta = require('quill-delta');
const fs = require('fs');
const path = require('path');
const { quill } = require('./quill');
const footer = require('./footer');
const store = require('./store');

let activeFile = '';
let initial = '';
const empty = new Delta([
  { insert: '\n' },
]);

const hasChanges = function hasChanges() {
  store.set('hasChanges', true);
  footer.hasChanges();
};

const noChanges = function noChanges() {
  store.set('hasChanges', false);
  footer.noChanges();
};

const removeActive = function removeActiveClassFromSidebar() {
  const elems = document.querySelectorAll('.active');
  if (elems && elems.length !== 0) {
    elems.forEach((el) => {
      el.classList.remove('active');
    });
  }
};

module.exports = {
  read(p) {
    if (!p || p === '') { throw new Error('Cannot read from empty path.'); }

    let contents;
    try {
      contents = fs.readFileSync(p).toString();
    } catch (error) {
      throw new Error(error);
    }

    if (contents && contents !== '') {
      try {
        const delta = new Delta(JSON.parse(contents));
        initial = delta;
        quill.setContents(delta, 'silent');
      } catch (error) {
        // File is not JSON
        throw new Error('File is not in JSON format.');
      }
    }
  },
  write(p) {
    if (!p || p === '') { throw new Error('Cannot write to empty path.'); }

    const contents = JSON.stringify(quill.getContents());

    fs.writeFile(p, contents, (error) => {
      if (error) { throw new Error(error); }
    });
  },
  saveDialog() {
    const choice = dialog.showSaveDialog({
      defaultPath: store.get('path'),
      filters: [{
        name: 'Custom File Type',
        extensions: ['note'],
      }],
    });

    return choice;
  },
  checkChanges() {
    // Ask user to save changes to current file
    if (store.get('hasChanges')) {
      const choice = dialog.showMessageBox({
        type: 'question',
        buttons: ['Save', 'Cancel', 'Don\'t Save'],
        title: 'Confirm',
        message: 'This file has changes, do you want to save them?',
        detail: 'Your changes will be lost if you close this item without saving.',
        icon: `${app.image}`,
      });

      if (choice === 1) {
        return false;
      }

      if (choice === 2) {
        noChanges();
      } else if (choice === 0) {
        module.exports.save();
      }
    }

    return true;
  },
  save() {
    // If file does not exist, save it somewhere
    if (!activeFile || activeFile === '') {
      const choice = module.exports.saveDialog();
      if (!choice || choice === '') return;
      activeFile = choice;
    }

    // Write the file contents
    module.exports.write(activeFile);

    // Reset the intial state to compare changes with
    initial = new Delta(quill.getContents());

    // Editor has no unsaved changes
    noChanges();

    // Update the stored file path
    module.exports.export();

    // Update footer filename
    footer.setFile(path.basename(activeFile, path.extname(activeFile)));
  },
  open(p) {
    if (!p || p === '') { throw new Error('Cannot open empty path.'); }

    const canOpen = module.exports.checkChanges();

    if (!canOpen) {
      return false;
    }

    // Reset editor contents
    quill.setContents(null, 'silent');

    // Clear history state
    quill.history.clear();

    // Read in the selected file contents
    try {
      module.exports.read(p);
    } catch (error) {
      console.error(error);
    }

    // Update the active file
    activeFile = p;

    // Update the settings
    module.exports.export();

    // Focus the editor
    quill.focus();

    // Update the footer
    footer.setFile(path.basename(activeFile, path.extname(activeFile)));
    footer.updateFileStats();

    return true;
  },
  reset() {
    const canReset = module.exports.checkChanges();
    if (!canReset) {
      return;
    }

    removeActive();
    noChanges();
    initial = '';
    activeFile = '';
    quill.setContents(null, 'silent');
    quill.history.clear();
    quill.focus();
    footer.setFile('untitled');
    footer.updateFileStats();
    module.exports.export();
  },
  set(p) {
    activeFile = p;
  },
  get() {
    return activeFile;
  },
  export() {
    store.set('activeFile', activeFile);
  },
  init() {
    // Setup activeFile
    if (store.get('file')) {
      activeFile = store.get('file');
      if (!activeFile || activeFile === '') {
        module.exports.reset();
      } else {
        removeActive();
        module.exports.open(activeFile);
      }
    } else { activeFile = ''; }

    // On change, update the flag
    quill.on('text-change', () => {
      let diff;

      // On text-change, update file stats
      footer.updateFileStats();

      // Check if contents are the same as when saved
      if (!initial || initial === '') {
        diff = quill.getContents().diff(empty);
      } else {
        diff = quill.getContents().diff(initial);
      }

      if (diff.ops.length === 0) {
        noChanges();
      } else {
        hasChanges();
      }
    });

    // On text selection or typing, update cursor stats
    // triggers on both text-change and selection change
    quill.on('editor-change', () => {
      footer.updateCursorStats();
    });
  },
};
