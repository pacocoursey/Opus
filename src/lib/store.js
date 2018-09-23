const settings = require('electron-settings');

let path;

module.exports = {
  init(str) {
    path = str;
  },
  set(key, value) {
    return settings.set(`windows.${path}.${key}`, value);
  },
  has(key) {
    return settings.has(`windows.${path}.${key}`);
  },
  get(key) {
    return settings.get(`windows.${path}.${key}`);
  },
};
