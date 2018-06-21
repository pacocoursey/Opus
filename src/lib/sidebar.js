const TreeView = require('./bin/tree.js');
const Tree = require('./tree.js');
const editor = require('./editor.js');
const chokidar = require('chokidar');
const settings = require('electron-settings');

let tree;

module.exports = {
  init() {
    const activeProject = '/Users/paco/Dropbox/school/opus';

    // Get the folder data
    if (settings.has('tree')) {
      const data = settings.get('tree');
      tree = Tree.register(data);
    } else {
      tree = Tree.createTree(activeProject);
    }

    // Setup the tree-view
    const treeView = new TreeView([tree.data], 'tree');

    // Watch the file system for changes
    const watcher = chokidar.watch(activeProject, {
      ignored: /(^|[/\\])\../,
      persistent: true,
    });

    // Event listeners
    treeView.on('select', (e) => {
      const p = e.data.path;
      const f = editor.get();

      // Open the file if it is not already active
      if (f !== p) {
        editor.open(p);
      }
    });

    treeView.on('expand', (e) => {
      const name = JSON.parse(e.target.getAttribute('data-item')).path;
      tree.open(name);
    });

    treeView.on('collapse', (e) => {
      const name = JSON.parse(e.target.getAttribute('data-item')).path;
      tree.close(name);
    });

    watcher.on('ready', () => {
      // Check if removed file is active in the editor
      watcher.on('unlink', (p) => {
        if (editor.get() === p) { editor.reset(); }
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
    settings.set('tree', tree.get());
  },
};
