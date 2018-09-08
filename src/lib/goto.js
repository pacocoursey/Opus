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
    const line = input.value - 1;

    if (line >= editor.children.length || line < 0) {
      console.log('Early exit');
      return;
    }

    const element = editor.children[line];
    console.log(element);
    const text = quill.getText();
    const pos = text.search(element.innerText);

    quill.setSelection(pos, element.innerText.length, 'api');

    module.exports.deactivate();
  },
};
