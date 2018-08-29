const { app, dialog } = require('electron').remote;
const Delta = require('quill-delta');
const fs = require('fs');
const path = require('path');
const settings = require('electron-settings');
const { quill } = require('./quill');
const footer = require('./footer');

let plain = false;
let activeFile = '';
let initial = '';
const empty = new Delta([
  { insert: '\n' },
]);

const hasChanges = function hasChanges() {
  app.hasChanges = true;
  footer.hasChanges();
};

const noChanges = function noChanges() {
  app.hasChanges = false;
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
        plain = false;
        initial = delta;
        quill.setContents(delta, 'silent');
      } catch (error) {
        // File is not JSON
        plain = true;
        initial = contents;
        quill.setText(contents, 'silent');
        // TODO: disable quill key bindings, put text in monospace
        // quill.formatText(0, quill.getLength(), 'font', 'monospace', 'silent');
      }
    }
  },
  write(p) {
    if (!p || p === '') { throw new Error('Cannot write to empty path.'); }

    const contents = JSON.stringify(quill.getContents());

    // if (plain) {
    //   contents = quill.getText();
    // } else {
    //   contents = JSON.stringify(quill.getContents());
    // }

    fs.writeFile(p, contents, (error) => {
      if (error) { throw new Error(error); }
    });
  },
  saveDialog() {
    const choice = dialog.showSaveDialog({
      defaultPath: settings.get('project'),
    });

    return choice;
  },
  checkChanges() {
    // Ask user to save changes to current file
    if (app.hasChanges) {
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

    // Update footer filename
    footer.setFile(path.basename(activeFile));
  },
  open(p) {
    if (!p || p === '') { throw new Error('Cannot open empty path.'); }

    module.exports.checkChanges();

    // Reset editor contents
    quill.setContents(null, 'silent');

    // Clear history state
    quill.history.clear();

    // Read in the selected file contents
    try {
      module.exports.read(p);
    } catch (error) {
      console.log(error);
    }

    // Update the active file
    activeFile = p;

    // Update the settings
    module.exports.export();

    // Focus the editor
    quill.focus();

    // Update the footer
    footer.setFile(path.basename(activeFile));

    return true;
  },
  reset() {
    const canReset = module.exports.checkChanges();
    if (!canReset) {
      return;
    }

    removeActive();
    noChanges();
    footer.setFile('untitled');
    initial = '';
    quill.setContents(null, 'silent');
    quill.history.clear();
    quill.focus();
    activeFile = '';
  },
  set(p) {
    activeFile = p;
  },
  get() {
    return activeFile;
  },
  export() {
    settings.set('file', activeFile);
  },
  init() {
    // Setup activeFile
    if (settings.has('file')) {
      activeFile = settings.get('file');
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

      // Check if contents are the same as when saved
      if (!initial || initial === '') {
        if (plain) {
          diff = quill.getText() === '';
        } else {
          diff = quill.getContents().diff(empty);
        }
      } else if (plain) {
        diff = quill.getText() === initial;
      } else {
        diff = quill.getContents().diff(initial);
      }

      if (plain) {
        if (diff.length === 0) {
          noChanges();
        } else {
          hasChanges();
        }
      } else if (diff.ops.length === 0) {
        noChanges();
      } else {
        hasChanges();
      }
    });

    // On text-change, update file stats
    // does not trigger on selection change (faster)
    quill.on('text-change', () => {
      footer.updateFileStats();
    });

    // On text selection or typing, update cursor stats
    // triggers on both text-change and editor change
    quill.on('editor-change', () => {
      footer.updateCursorStats();
    });
  },
};
