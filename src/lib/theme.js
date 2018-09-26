const store = require('./store');

/**
 * Initialize the body with the appropriate class.
 */

function init() {
  let isDark = false;

  if (store.has('dark')) {
    isDark = store.get('dark');
  }

  if (isDark) {
    document.body.classList.add('dark');
  }
}

/**
 * Toggle the body classList and update the store.
 */

function toggle() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  store.set('dark', isDark);
}

module.exports = {
  init,
  toggle,
};
