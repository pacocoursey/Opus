const dirTree = require('./bin/directoryTree.js');
const { flatten, unflatten } = require('flat');

const update = function getUpdatedProjectTree(p) {
  if (!p || p === '') { throw new Error('Path cannot be empty.'); }

  this.data = dirTree(p, {
    exclude: /(^|[/\\])\../,
  });
};

const convert = function convertDotToReference(object, reference) {
  function arrDeref(o, ref, i) { return !ref ? o : (o[ref.slice(0, i ? -1 : ref.length)]); }
  function dotDeref(o, ref) { return ref.split('[').reduce(arrDeref, o); }
  return !reference ? object : reference.split('.').reduce(dotDeref, object);
};

const find = function findObjectBypath(p) {
  if (!p || p === '') { throw new Error('Path cannot be empty.'); }

  if (!this.data) { throw new Error('Reference object does not contain data value.'); }

  const obj = flatten(this.data);
  let ret = null;

  Object.entries(obj).forEach(([key, value]) => {
    if (value === p) { ret = key; }
  });

  if (ret) {
    ret = ret.substring(0, ret.lastIndexOf('.'));
    return convert(unflatten(obj), ret);
  }

  return false;
};

const show = function showDisplayableProjectObject(p) {
  return [
    {
      path: p,
      type: 'directory',
      root: true,
    },
  ];
};

const format = function formatObject(o) {
  if (!o.path || !o.type) { throw new Error('Object does not contain path or type values.'); }

  return {
    path: o.path,
    type: o.type,
  };
};

const get = function getDisplayableObject(o) {
  const arr = [];

  if (o.children) {
    o.children.forEach((child) => {
      arr.push(format(child));
    });
  }

  return arr;
};

const parent = function getParentDirectory(p) {
  if (!p || p === '') { throw new Error('Path cannot be empty.'); }

  const parentDir = p.substring(0, p.lastIndexOf('/'));
  const o = this.find(parentDir);

  if (!o) return this.parent(parentDir);
  return parentDir;
};

module.exports = {
  createTree(p) {
    const tree = {
      data: null,
    };

    tree.get = get;
    tree.find = find;
    tree.show = show;
    tree.parent = parent;
    tree.update = update;
    tree.update(p);

    return tree;
  },
};
