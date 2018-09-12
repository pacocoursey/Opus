const assert = require('assert');

let project = {};

module.exports = {
  init(obj) {
    project = obj;
  },
  set(key, value) {
    assert.strictEqual(
      typeof key,
      'string',
      'First parameter of set must be a string.',
    );

    project[key] = value;
    return project;
  },
  has(key) {
    return Object.prototype.hasOwnProperty.call(project, key);
  },
  get(key) {
    assert.strictEqual(
      typeof key,
      'string',
      'First parameter of set must be a string.',
    );

    if (Object.prototype.hasOwnProperty.call(project, key)) {
      return project[key];
    }

    return undefined;
  },
};
