const { flatten, unflatten } = require('flat');
const settings = require('electron-settings');
const dirTree = require('./bin/directoryTree');

const tree = {
  data: null,
};

const update = function getUpdatedProjectTree(p) {
  if (!p || p === '') { throw new Error('Path cannot be empty.'); }

  tree.data = null;
  tree.data = dirTree(p, {
    extensions: /\.note/,
  });
  tree.data.root = true;
};

const convert = function convertDotToReference(object, reference) {
  function arrDeref(o, ref, i) { return !ref ? o : (o[ref.slice(0, i ? -1 : ref.length)]); }
  function dotDeref(o, ref) { return ref.split('[').reduce(arrDeref, o); }
  return !reference ? object : reference.split('.').reduce(dotDeref, object);
};

const find = function findObjectBypath(p) {
  if (!p || p === '') { throw new Error('Path cannot be empty.'); }

  if (!tree.data) { throw new Error('Tree does not contain data value.'); }

  const obj = flatten(tree.data);
  let ret = null;

  Object.entries(obj).forEach(([key, value]) => {
    if (value === p) { ret = key; }
  });

  if (ret) {
    if (ret.includes('.')) {
      ret = ret.substring(0, ret.lastIndexOf('.'));
      return convert(tree.data, ret);
    }

    // Object is parent
    return tree.data;
  }

  return false;
};

const open = function openFolder(p) {
  const o = find(p);
  o.expanded = true;
};

const close = function closeFolder(p) {
  const o = find(p);
  o.expanded = false;
};

const parent = function getParent(key) {
  return key.substring(0, key.lastIndexOf('.'));
};

const getSettings = function getExpandedDataObjects() {
  const data = flatten(JSON.parse(JSON.stringify(tree)).data);

  const paths = [];
  let tmp;

  // Save the paths of the expanded directories
  Object.keys(data).forEach((key) => {
    if (key.includes('expanded') && data[key] === true) {
      if (key.includes('.')) {
        tmp = `${parent(key)}.path`;
      } else { tmp = 'path'; }
      paths.push(data[tmp]);
    }
  });

  return paths;
};

const applySettings = function applyExtendedPropToFolders(paths) {
  const o = flatten(tree.data);

  Object.entries(o).forEach(([key, value]) => {
    if (paths.includes(value)) {
      if (key.includes('.')) {
        o[`${parent(key)}.expanded`] = true;
      } else { o.expanded = true; }
    }
  });

  // Unflatten
  tree.data = unflatten(o);
};

const reload = function reloadDocumentTree(p) {
  // Deep copy and flatten the tree object
  const old = flatten(JSON.parse(JSON.stringify(tree)).data);

  // List the paths that are open
  const paths = [];
  let tmp;
  let active;

  if (settings.has('file')) {
    active = settings.get('file');
  }

  Object.keys(old).forEach((key) => {
    if (key.includes('expanded') && old[key] === true) {
      if (key.includes('.')) {
        tmp = `${parent(key)}.path`;
      } else { tmp = 'path'; }
      paths.push(old[tmp]);
    }
  });

  // Update the tree object
  tree.update(p);

  // Flatten the updated tree object
  const o = flatten(tree.data);

  // Find the object with the same paths, add the expanded prop
  Object.entries(o).forEach(([key, value]) => {
    if (value === active) { o[`${parent(key)}.active`] = true; }

    if (paths.includes(value)) {
      if (key.includes('.')) {
        o[`${parent(key)}.expanded`] = true;
      } else { o.expanded = true; }
    }
  });

  // Unflatten
  tree.data = unflatten(o);
};

module.exports = {
  createTree(p, paths) {
    tree.update = update;
    tree.find = find;
    tree.open = open;
    tree.close = close;
    tree.reload = reload;
    tree.getSettings = getSettings;
    tree.applySettings = applySettings;
    tree.update(p);

    if (paths && paths.length !== 0) {
      tree.applySettings(paths);
    }

    return tree;
  },
};
