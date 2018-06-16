const dirTree = require('directory-tree');
const { flatten, unflatten } = require('flat');

const update = function getUpdatedProjectTree(p) {
  if (!p || p === '') { throw new Error(); }

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
    },
  ];
};

const format = function formatObject(o) {
  return {
    path: o.path,
    type: o.type,
  };
};

const get = function getDisplayableObject(o) {
  const arr = [];

  o.children.forEach((child) => {
    arr.push(format(child));
  });

  return arr;
};

module.exports = {
  createTree(p) {
    const tree = {
      data: null,
    };
    tree.get = get;
    tree.find = find;
    tree.show = show;
    tree.update = update;
    tree.update(p);

    return tree;
  },
};
