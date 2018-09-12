const store = require('./store');

module.exports = {
  init() {
    let isDark = false;

    if (store.get('theme')) {
      isDark = store.get('theme');
    }

    if (isDark) {
      document.body.classList.add('dark');
    }
  },
  toggle() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    store.set('theme', isDark);
  },
};
