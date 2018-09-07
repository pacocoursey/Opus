const { quill } = require('./quill');

const el = document.querySelector('.find');
const input = document.querySelector('.find-input');
const form = document.querySelector('.find-form');
const editor = document.querySelector('.ql-editor');

let active = false;
let startPosition = 0;
let counter = 0;
let currentString = '';

module.exports = {
  // If find is already active, do nothing
  activate() {
    if (active) {
      input.focus();
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


    // Listen for editor click to clear the highlights
    editor.addEventListener('click', () => {
      module.exports.clear();
    });

    // Listen for enter key to start searching document
    form.addEventListener('submit', module.exports.submit);
  },
  escape(e) {
    // Escape key was pressed
    if (e.keyCode === 27) {
      // Hide the find element
      module.exports.toggle();

      // Clear the highlights
      module.exports.clear();

      // Reset everything
      startPosition = 0;
      counter = 0;
      currentString = '';
      active = false;

      // Remove the event listeners now that find mode is inactive
      form.removeEventListener('submit', module.exports.submit, true);
      window.removeEventListener('keydown', module.exports.escape, false);
    }
  },
  submit(e) {
    e.preventDefault();
    module.exports.find();
  },
  clear() {
    // Remove the style from all find matches
    document.querySelectorAll('.highlight').forEach((element) => {
      element.removeAttribute('style');
    });
  },
  find() {
    const str = input.value;
    module.exports.clear();

    if (!str || str === '') {
      return;
    }

    // If looking for a new string, reset
    if (str !== currentString) {
      currentString = str;
      startPosition = 0;
      counter = 0;
    }

    const text = quill.getText(startPosition);
    const reg = new RegExp(str, 'i');
    let position = text.search(reg);

    // Search string was not found
    if (position === -1) {
      // We had at least one match
      // start search over!
      if (counter !== 0) {
        counter = 0;
        startPosition = 0;
        module.exports.find();
      } else {
        console.log('No results found.');
        input.classList.add('error');
        setTimeout(() => {
          input.classList.remove('error');
        }, 1000);
      }
      return;
    }

    // Increment the counter
    counter += 1;
    position += startPosition;

    // Increment the startPosition so we know where
    // to start looking from next time
    startPosition = position + str.length;

    // Highlight the found occurence
    quill.formatText(position, str.length, 'highlight', true, 'api');

    // Scroll the highlighted element into view smoothly!
    // Damn, scrollIntoView() is amazing.
    const hl = document.querySelector('.highlight');
    hl.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
    });
  },
  toggle() {
    el.classList.toggle('show');
  },
};
