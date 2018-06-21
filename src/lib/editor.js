const { quill } = require('./quill.js');
const footer = require('./footer.js');
const { app, dialog } = require('electron').remote;
const Delta = require('quill-delta');
const fs = require('fs');
const path = require('path');
const settings = require('electron-settings');

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

module.exports = {
  read(p) {
    if (!p || p === '') { throw new Error('Cannot read from empty path.'); }

    const contents = fs.readFileSync(p).toString();

    if (contents && contents !== '') {
      const delta = new Delta(JSON.parse(contents));
      initial = delta;
      quill.setContents(delta, 'silent');
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
      title: 'wtf',
      defaultPath: '/Users/paco/Dropbox/school/opus/',
    });

    return choice;
  },
  save() {
    if (!activeFile || activeFile === '') {
      activeFile = module.exports.saveDialog();
    }

    // Write the file contents
    module.exports.write(activeFile);

    // Editor has no unsaved changes
    noChanges();
  },
  open(p) {
    if (!p || p === '') { throw new Error('Cannot open empty path.'); }

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
        return;
      } else if (choice === 2) {
        noChanges();
      } else if (choice === 0) {
        module.exports.save();
      }
    }

    // Reset editor contents
    quill.setContents(null, 'silent');

    // Clear history state
    quill.history.clear();

    // Read in the selected file contents
    module.exports.read(p);

    // Update the active file
    activeFile = p;

    // Focus the editor
    quill.focus();

    // Update the footer
    footer.setFile(path.basename(activeFile));
  },
  reset() {
    noChanges();
    initial = '';
    quill.setContents(null, 'silent');
    quill.history.clear();
    quill.focus();
    activeFile = '';
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
      console.log(`settings file: ${activeFile}`);
      if (!activeFile || activeFile === '') {
        module.exports.reset();
      } else {
        module.exports.open(activeFile);
      }
    } else { activeFile = ''; }

    // On change, update the flag
    quill.on('text-change', () => {
      let diff;

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

    // On text selection or typing, update footer
    quill.on('editor-change', () => {
      const range = quill.getSelection();

      if (range) {
        const lines = quill.getText(0, range.index).split('\n');
        const lineCount = lines.length;
        const charPosition = lines[lineCount - 1].length + 1;

        if (range.length === 0) {
          footer.update(lineCount, charPosition, null);
        } else {
          const text = quill.getText(range.index, range.length);
          const selection = {
            lines: text.split('\n').length,
            chars: text.length,
          };
          footer.update(lineCount, charPosition, selection);
        }
      }
    });
  },
};
