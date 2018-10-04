const chokidar = require('chokidar');
const TreeView = require('./lib/tree');
const Tree = require('./tree');
const editor = require('./editor');
const store = require('./store');

const wrapper = document.querySelector('.wrapper');
let tree;

module.exports = {
  init() {
    const activeProject = store.get('path');

    // Determine whether to show aside or not on load
    if (store.has('sidebar')) {
      if (!store.get('sidebar')) {
        wrapper.classList.add('slide');
      }
    }

    // Get the folder data
    if (store.has('tree')) {
      tree = Tree.createTree(activeProject, store.get('tree'));
    } else {
      tree = Tree.createTree(activeProject, null);
    }

    // Ensure the active prop on the active file
    if (store.has('file')) {
      const file = store.get('file');
      if (file && file !== '') { tree.find(file).active = true; }
    }

    // Setup the tree-view
    const treeView = new TreeView([tree.data], 'tree');

    // Watch the file system for changes
    const watcher = chokidar.watch(activeProject, {
      ignored: /(^|[/\\])\../,
      persistent: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
      },
    });

    treeView.on('select', (e) => {
      const { data, target } = e;
      const { path } = data;
      const oldPath = editor.get();

      if (oldPath !== path) {
        const ret = editor.open(path);

        if (!ret) { return; }

        if (oldPath && oldPath !== '') {
          tree.find(oldPath).active = false;
        }

        tree.find(path).active = true;

        document.querySelectorAll('.active').forEach((el) => {
          el.classList.remove('active');
        });

        target.classList.add('active');
      }

      module.exports.export();
    });

    treeView.on('expand', (e) => {
      const { path } = e;
      if (path) {
        tree.open(path);
      }

      module.exports.export();
    });

    treeView.on('collapse', (e) => {
      const { path } = e;
      if (path) {
        tree.close(path);
      }

      module.exports.export();
    });

    watcher.on('ready', () => {
      // Check if removed file is active in the editor
      watcher.on('unlink', (p) => {
        if (editor.get() === p) { editor.reset(); }
      });

      // Check if changed file is active in the editor
      watcher.on('change', (p) => {
        if (editor.get() === p) { editor.reload(); }
      });

      watcher.on('all', (() => {
        // Update the document object tree
        tree.reload(activeProject);

        // Update the DOM with new data (preserves open states)
        treeView.reload([tree.data], 'tree');
      }));

      watcher.on('error', (error) => {
        throw new Error(`Watcher error: ${error}`);
      });
    });
  },
  export() {
    // Save the tree state
    store.set('tree', tree.getSettings());
  },
  toggle() {
    wrapper.classList.toggle('slide');
    const isSlid = wrapper.classList.contains('slide');
    store.set('sidebar', !isSlid);
  },
};
