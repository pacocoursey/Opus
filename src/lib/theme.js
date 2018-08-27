const settings = require('electron-settings');

module.exports = {
  init() {
    let isDark = false;

    if (settings.has('theme')) {
      isDark = settings.get('theme');
    }

    if (isDark) {
      document.body.classList.add('dark');
    }
  },
  toggle() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    settings.set('theme', isDark);
  },
};
