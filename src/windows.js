let windows = {};

function get(path) {
  if (!path) {
    return windows;
  }

  if (windows[path]) {
    return windows[path];
  }

  throw new Error(`Could not find BrowserWindow for path ${path}`);
}

function set(path, win) {
  windows[path] = win;
}

function has(path) {
  if (windows[path]) {
    return true;
  }

  return false;
}

function reset() {
  windows = {};
}

function del(path) {
  delete windows[path];
}

module.exports = {
  get,
  set,
  has,
  reset,
  delete: del,
};
