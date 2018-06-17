const quill = require('./quill.js');
const Delta = require('quill-delta');
const fs = require('fs');

let activeFile = '';

module.exports = {
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

// On change, update the flag
let hasChanged = false;
quill.on('text-change', () => {
  hasChanged = true;
});

// Every second, check if change has been made
// If it has, write the file
setInterval(() => {
  if (hasChanged && activeFile && activeFile !== '') {
    module.exports.write(activeFile);
  }
  hasChanged = false;
}, 1000);

// Check for unsaved data
window.onbeforeunload = () => {
  if (hasChanged) {
    console.error('There are unsaved changes. Are you sure you want to leave?');
  }
};
