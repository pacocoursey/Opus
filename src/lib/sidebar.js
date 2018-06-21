const TreeView = require('./bin/tree.js');
const Tree = require('./tree.js');
const editor = require('./editor.js');
const chokidar = require('chokidar');

module.exports = {
  init() {
    const activeProject = '/Users/paco/Dropbox/school/opus';
    const log = console.log.bind(console);

    // Get the folder data
    const tree = Tree.createTree(activeProject);

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
      // TODO: do something with editor when active file is removed
      watcher.on('unlink', (p) => {
        if (editor.get() === p) { editor.set(''); log('big problem'); }
      });

      watcher.on('all', (() => {
        // Update the document object tree
        tree.reload(activeProject);

        // Update the DOM with new data (preserves open states)
        treeView.reload([tree.data], 'tree');
      }));
      watcher.on('error', error => log(`Watcher error: ${error}`));
    });
  },
};
