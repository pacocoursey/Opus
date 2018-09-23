const store = require('./store');

module.exports = {
  init() {
    let isDark = false;

    if (store.has('dark')) {
      isDark = store.get('dark');
    }

    if (isDark) {
      document.body.classList.add('dark');
    }
  },
  toggle() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    store.set('dark', isDark);
  },
};
