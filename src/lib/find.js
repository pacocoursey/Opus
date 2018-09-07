const { quill } = require('./quill');

const el = document.querySelector('.find');
const input = document.querySelector('.find-input');
const form = document.querySelector('.find-form');
let active = false;
let startPosition = 0;
let currentString = '';

module.exports = {
  // If find is already active, do nothing
  activate() {
    if (active) {
      return;
    }

    // Show, reset, and focus the input
    // set find state to active
    module.exports.toggle();
    input.value = '';
    input.focus();
    active = true;

    // Listen for escape key to close find
    // TODO: add it to the menu?
    window.addEventListener('keydown', module.exports.escape);

    // Listen for enter key to start searching document
    form.addEventListener('submit', module.exports.submit);
  },
  escape(e) {
    // Escape key was pressed
    if (e.keyCode === 27) {
      module.exports.toggle();
      active = false;

      module.exports.clear();

      form.removeEventListener('submit', module.exports.submit, true);
      window.removeEventListener('keydown', module.exports.escape, false);
    }
  },
  clear() {
    // Remove the style from all find matches
    document.querySelectorAll('.highlight').forEach((element) => {
      element.removeAttribute('style');
    });
  },
  submit(e) {
    console.log('Callback.');
    e.preventDefault();
    const str = input.value;
    module.exports.clear();

    if (!str || str === '') {
      return;
    }

    // If not finding next occurence, reset
    if (str !== currentString) {
      currentString = str;
      startPosition = 0;
    }

    const text = quill.getText(startPosition);
    const reg = new RegExp(str, 'i');
    const position = text.search(reg);

    // Search string was not found
    if (position === -1) {
      console.log('No results found.');
      return;
    }

    const existing = quill.getText(position, str.length);
    startPosition = position + str.length;

    quill.deleteText(position, str.length, 'api');
    quill.insertText(position, existing, 'highlight', true, 'api');
  },
  toggle() {
    el.classList.toggle('show');
  },
};
