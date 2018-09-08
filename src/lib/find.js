const { quill } = require('./quill');

const el = document.querySelector('.find');
const input = document.querySelector('.find-input');
const form = document.querySelector('.find-form');
const stats = document.querySelector('.find-stats');
const editor = document.querySelector('.ql-editor');

let active = false;
let currentString = '';
let isFirst = true;
let indeces = [];
let index = 0;

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
    window.addEventListener('keydown', module.exports.escape);

    // Listen for editor click to clear the highlights
    editor.addEventListener('click', () => {
      module.exports.clear();
    });

    // Listen for enter key to start searching document
    form.addEventListener('submit', module.exports.submit);
  },
  deactivate() {
    // Remove the event listeners now that find mode is inactive
    form.removeEventListener('submit', module.exports.submit, false);
    window.removeEventListener('keydown', module.exports.escape, false);

    // Hide the find element, clear the highlights
    module.exports.toggle();
    module.exports.clear();

    // Reset everything
    stats.innerText = '';
    currentString = '';
    active = false;
    isFirst = true;
  },
  escape(e) {
    // Escape key was pressed
    if (e.keyCode === 27) {
      module.exports.deactivate();
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
  indeces(source, find) {
    const results = [];
    let i = 0;

    for (i = 0; i < source.length; i += 1) {
      if (source.substring(i, i + find.length).toLowerCase() === find) {
        results.push(i);
      }
    }

    return results;
  },
  find(increment = 1) {
    const str = input.value;
    module.exports.clear();

    if (!str || str === '') {
      return;
    }

    // If looking for a new string, reset
    if (str !== currentString) {
      currentString = str;
      isFirst = true;
      stats.innerText = '';
    } else {
      // Looking for the same string, not first
      isFirst = false;
    }

    if (isFirst) {
      const text = quill.getText();
      indeces = module.exports.indeces(text, str);
      index = 0;
    } else {
      // Change the index, wrapping at ends
      index += increment;
      if (index === -1) {
        index = indeces.length - 1;
      } else {
        index %= indeces.length;
      }
    }

    // No occurences found
    if (indeces.length === 0) {
      console.log('No results found.');
      input.classList.add('error');
      setTimeout(() => {
        input.classList.remove('error');
      }, 1000);
      return;
    }

    // Update the find stats
    stats.innerText = `${index + 1}/${indeces.length}`;

    // Highlight the found occurence
    quill.formatText(indeces[index], str.length, 'highlight', true, 'api');

    // Scroll the highlighted element into view smoothly!
    // Damn, scrollIntoView() is amazing.
    const hl = document.querySelector('.highlight');

    // For some reason the highlight class could not be applied
    // i.e. found text is inside a <pre> tag codeblock
    if (!hl || hl === '') {
      console.warn('The occurence of the found word is inside an element that could not be highlighted. Sorry, fix soon?');
      return;
    }

    hl.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
    });
  },
  toggle() {
    el.classList.toggle('show');
  },
};
