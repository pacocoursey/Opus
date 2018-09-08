const { quill } = require('./quill');

const editor = document.querySelector('.ql-editor');
const go = document.querySelector('.goto');

const el = document.querySelector('.find');
const input = document.querySelector('.find-input');
const form = document.querySelector('.find-form');
const stats = document.querySelector('.find-stats');
const replaceInput = document.querySelector('.find-replace-input');
const replaceEls = document.querySelectorAll('.find-replace');

let active = false;
let currentString = '';
let isFirst = true;
let indeces = [];
let index = 0;
let replace = false;

module.exports = {
  activate(isReplace = false) {
    // If find is already active, do nothing
    if (active && !isReplace) {
      input.focus();
      return;
    }

    // Show, reset, and focus the input
    // set find state to active
    el.classList.add('show');
    go.classList.remove('show');

    // If we are in replace mode, show the replace input
    if (isReplace) {
      replaceEls.forEach(e => e.classList.add('show'));
    }

    input.value = '';
    replaceInput.value = '';
    input.focus();
    active = true;
    replace = isReplace;

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
    el.classList.remove('show');
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
    module.exports.find(1);
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

    if (replace) {
      // Insert the replacement text
      quill.deleteText(indeces[index], str.length, 'user');
      quill.insertText(indeces[index], replaceInput.value, 'user');

      // Must adjust indeces values for
      // differences in replacement string length
      /* eslint-disable-next-line */
      indeces = indeces.map(i => i += replaceInput.value.length - str.length);
    } else {
      // Highlight the found occurence
      quill.formatText(indeces[index], str.length, 'highlight', true, 'silent');
    }

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
};
