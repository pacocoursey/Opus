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

    // Clone the projects object to avoid storing the window object
    const clone = {};
    clone[path] = {
      path: projects[path].path,
      hasChanges: projects[path].hasChanges,
      isSlid: projects[path].isSlid,
      theme: projects[path].theme,
      activeFile: projects[path].activeFile,
      tree: projects[path].tree,
    };

    // Save the clone to settings
    settings.set('projects', clone);

    return projects[path];
  },
  has(key) {
    return Object.prototype.hasOwnProperty.call(projects[path], key);
  },
  get(key) {
    assert.strictEqual(
      typeof key,
      'string',
      'First parameter of get must be a string.',
    );

    if (Object.prototype.hasOwnProperty.call(projects[path], key)) {
      return projects[path][key];
    }

    return undefined;
  },
};
