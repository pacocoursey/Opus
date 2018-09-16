const { remote } = require('electron');
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

    projects[path][key] = value;
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
