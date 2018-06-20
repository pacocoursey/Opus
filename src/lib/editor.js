const { quill } = require('./quill.js');
const footer = require('./footer.js');
const Delta = require('quill-delta');
const fs = require('fs');

let activeFile = '';

module.exports = {
  init() {
    // On change, update the flag
    let hasChanged = false;
    quill.on('text-change', () => {
      console.log('change?');
      hasChanged = true;
    });

    // On text selection, update footer
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
      } else {
        console.log('User cursor is not in editor');
      }
    });

    // Every second, check if change has been made
    // If it has, write the file
    // setInterval(() => {
    //   if (hasChanged && activeFile && activeFile !== '') {
    //     module.exports.write(activeFile);
    //   }
    //   hasChanged = false;
    // }, 1000);

    // Check for unsaved data
    window.onbeforeunload = () => {
      if (hasChanged) {
        console.log('There are unsaved changes. Are you sure you want to leave?');
      }
    };
  },
  read(p) {
    if (!p || p === '') { throw new Error('Cannot read from empty path.'); }

    const contents = fs.readFileSync(p).toString();

    if (!contents || contents === '') {
      quill.setContents(null, 'user');
      throw new Error(`File ${p} is empty.`);
    } else {
      const delta = new Delta(JSON.parse(contents));
      quill.setContents(delta, 'user');
    }
  },
  write(p) {
    if (!p || p === '') { throw new Error('Cannot read to empty path.'); }

    console.log('Writing file: ', p);
    const contents = JSON.stringify(quill.getContents());
    fs.writeFile(p, contents, (error) => {
      if (error) { console.log(error); }
    });
  },
  set(p) {
    // If path is empty, reset the editor
    if (!p || p === '') {
      quill.setContents(null, 'user');
      activeFile = '';
    } else {
      activeFile = p;
    }
  },
  get() {
    return activeFile;
  },
};
