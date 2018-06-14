const quill = require('./quill.js');
const Delta = require('quill-delta');
const fs = require('fs');

module.exports = {
  readFile(path) {
    const contents = fs.readFileSync(path).toString();
    const delta = new Delta(JSON.parse(contents));
    quill.setContents(delta, 'user');
  },
  writeFile(path) {
    const contents = JSON.stringify(quill.getContents());
    fs.writeFile(path, contents, (error) => {
      if (error) { console.log(error); }
    });
  },
};

// Every second, monitor the text-change flag
// If true, save the entire file locally.
let hasChanged = false;
quill.on('text-change', () => {
  setInterval(() => {
    // writeFile
    hasChanged = false;
  }, 1000);
});

// Check for unsaved data
window.onbeforeunload = () => {
  if (hasChanged) {
    console.log('There are unsaved changes. Are you sure you want to leave?');
  }
};
