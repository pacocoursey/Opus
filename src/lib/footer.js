const { quill } = require('./quill');

const editor = document.querySelector('.ql-editor');
const stats = document.querySelector('.stats');
const position = document.querySelector('.position');
const selection = document.querySelector('.selection');
const fileStats = document.querySelector('.file-stats');
const file = document.querySelector('.file-name');
const find = document.querySelector('.find');
const findForm = document.querySelector('.find > form');
const findInput = document.querySelector('.find > form > input');
const time = document.querySelector('.time');

let findFlag = false;

module.exports = {
  init() {
    module.exports.updateFileStats();

    module.exports.updateTime();
    setInterval(module.exports.updateTime, 10000);
  },
  find() {
    // If find is already active do nothing
    if (findFlag) {
      return;
    }

    findFlag = true;
    stats.style.display = 'none';
    find.style.display = 'flex';
    findInput.value = '';
    findInput.focus();

    // Listen for escape key to close find
    window.addEventListener('keydown', module.exports.escape);

    // Listen for enter key to search document
    findForm.addEventListener('submit', module.exports.submit);
  },
  escape(e) {
    // Close and reset the find form when escape is pressed
    if (e.keyCode === 27) {
      stats.style.display = 'flex';
      find.style.display = 'none';
      findFlag = false;
      document.querySelectorAll('.highlight').forEach((el) => {
        console.log(el.parentNode);
      });
      findForm.removeEventListener('submit', module.exports.submit, true);
      window.removeEventListener('keydown', module.exports.escape, false);
    }
  },
  submit(e) {
    console.log('Callback.');
    e.preventDefault();
    const str = findInput.value;

    if (!str || str === '') {
      return;
    }

    const text = quill.getText();
    const pos = text.search(str);

    // Search string was not found
    if (pos === -1) {
      console.log('No results found.');
      return;
    }

    quill.deleteText(pos, str.length, 'api');
    quill.insertText(pos, str, 'highlight', true, 'api');
    // const el = window.getSelection().anchorNode.parentNode;
  },
  updateTime() {
    const date = new Date();
    time.textContent = `${date.getHours()}:${date.getMinutes()}`;
  },
  updateCursorStats() {
    const range = quill.getSelection();

    if (range) {
      const lines = quill.getText(0, range.index).split('\n');
      const line = lines.length;
      const char = lines[line - 1].length + 1;

      // Update the cursor position stats
      position.textContent = `${line}:${char}`;

      // Update the selection stats
      if (range.length !== 0) {
        const text = quill.getText(range.index, range.length).trim();
        const sLines = text.split('\n').length;
        const sChars = text.length;
        selection.textContent = `[${sLines}, ${sChars}]`;
      } else {
        selection.textContent = '';
      }
    }
  },
  updateFileStats() {
    const text = quill.getText().trim();
    const lines = editor.children.length;
    const words = text.length > 0 ? text.split(/\s+/).length : 0;

    // Update the file stats
    fileStats.textContent = `${lines}L ${words}W`;
  },
  setFile(name) {
    file.textContent = `${name}`;
  },
  hasChanges() {
    file.classList.add('unsaved');
  },
  noChanges() {
    file.classList.remove('unsaved');
  },
};
