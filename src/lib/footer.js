const position = document.querySelector('.position');
const selection = document.querySelector('.selection');
const file = document.querySelector('.file-name');

module.exports = {
  update(line, char, s) {
    if (!s) {
      position.textContent = `${line}:${char}`;
      selection.textContent = '';
    } else {
      position.textContent = `${line}:${char}`;
      selection.textContent = `[${selection.lines}:${selection.chars}]`;
    }
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
