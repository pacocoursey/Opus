const { quill } = require('./quill');

const el = document.querySelector('.goto');
const editor = document.querySelector('.ql-editor');
const input = document.querySelector('.goto-input');
const form = document.querySelector('.goto-form');

let active = false;

module.exports = {
  activate() {
    if (active) {
      input.focus();
    }

    module.exports.toggle();
    input.value = '';
    input.focus();
    active = true;

    window.addEventListener('keydown', module.exports.keydown);
    form.addEventListener('submit', module.exports.submit);
  },
  keydown(e) {
    if (e.keyCode === 27) {
      module.exports.deactivate();
    }
  },
  deactivate() {
    form.removeEventListener('submit', module.exports.submit, false);
    window.removeEventListener('keydown', module.exports.keydown, false);

    module.exports.toggle();
    input.value = '';
    active = false;
  },
  submit(e) {
    e.preventDefault();
    module.exports.goto();
  },
  toggle() {
    el.classList.toggle('show');
  },
  goto() {
    const line = parseInt(input.value, 10) - 1;

    if (line >= editor.children.length || line < 0) {
      input.classList.add('error');
      setTimeout(() => {
        input.classList.remove('error');
      }, 1000);
      return;
    }

    const element = editor.children[line];

    // The line was not found in the editor (somehow)
    if (!element || element === '') {
      throw new Error(`Goto element not found. Looking for line ${line}.`);
    }

    const text = quill.getText();
    const pos = text.indexOf(element.innerText);

    // The index of the line's text could not be found
    if (pos === -1) {
      throw new Error(`The index of line ${line} text could not be found.`);
    }

    // Set the editor selection
    quill.setSelection(pos, element.innerText.length, 'api');

    // Deactivate the goto element
    module.exports.deactivate();
  },
};
