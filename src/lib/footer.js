const { quill } = require('./quill');

const position = document.querySelector('.position');
const selection = document.querySelector('.selection');
const fileStats = document.querySelector('.file-stats');
const file = document.querySelector('.file-name');
const time = document.querySelector('.time');

module.exports = {
  init() {
    module.exports.updateFileStats();

    module.exports.updateTime();
    setInterval(module.exports.updateTime, 10000);
  },
  updateTime() {
    const date = new Date();
    time.textContent = `${date.getHours()}:${date.getMinutes()}`;
  },
  updateCursorStats() {
    const range = quill.getSelection();

    if (range) {
      const lines = quill.getText(0, range.index).trim().split('\n');
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
    const lines = text.split('\n').length;
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
