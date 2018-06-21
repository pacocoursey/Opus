const { quill } = require('./quill.js');
const footer = require('./footer.js');
const Delta = require('quill-delta');
const { app, dialog } = require('electron').remote;
const fs = require('fs');

let activeFile = '';

module.exports = {
  init() {
    // On change, update the flag
    quill.on('text-change', () => {
      // Update footer
      footer.hasChanges();

      // Editor has unsaved changes
      app.hasChanges = true;
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
  read(p) {
    if (!p || p === '') { throw new Error('Cannot read from empty path.'); }

    const contents = fs.readFileSync(p).toString();

    if (contents && contents !== '') {
      const delta = new Delta(JSON.parse(contents));
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
  save() {
    if (!activeFile || activeFile === '') { throw new Error('Cannot save unset active file.'); }

    // Write the file contents
    module.exports.write(activeFile);

    // Editor has no unsaved changes
    app.hasChanges = false;

    // Update the footer
    footer.noChanges();
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
        app.hasChanges = false;
        footer.noChanges();
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
  },
  set(p) {
    // If path is empty, reset the editor
    if (!p || p === '') {
      quill.setContents(null, 'silent');
      activeFile = '';
    } else {
      activeFile = p;
    }
  },
  get() {
    return activeFile;
  },
};
