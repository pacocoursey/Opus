const { remote } = require('electron');
const settings = require('electron-settings');
const assert = require('assert');

let path;
const projects = remote.getGlobal('projects');

module.exports = {
  path(str) {
    path = str;
  },
  set(key, value) {
    assert.strictEqual(
      typeof key,
      'string',
      'First parameter of set must be a string.',
    );

    // Update the global object
    projects[path][key] = value;

    // Save the global object to settings
    settings.set('projects', projects);

    return projects[path];
  },
  has(key) {
    return Object.prototype.hasOwnProperty.call(projects[path], key);
  },
  get(key) {
    assert.strictEqual(
      typeof key,
      'string',
      'First parameter of set must be a string.',
    );

    if (Object.prototype.hasOwnProperty.call(projects[path], key)) {
      return projects[path][key];
    }

    return undefined;
  },
};
