const Tree = require('./lib/tree.js');
const editor = require('./lib/editor.js');
const treeView = require('./lib/bin/treeView.js');
const t = require('./lib/theme.js');
const m = require('./lib/bin/menu.js');
const chokidar = require('chokidar');

// TODO: electron-settings to remember editor state
// TODO: re-write my own tree-view module
// TODO: :emoji: plugin

const activeProject = '/Users/paco/Dropbox/school/opus';
const log = console.log.bind(console);

// Intialize themes
t.start();

// Initialize menu
m.init();

// Setup the document tree
const tree = Tree.createTree(activeProject);

// Initialize tree view
const browser = treeView({ style: false });
browser.on('directory', (p) => {
  // console.log('You clicked on a directory (%s)', p);

  const o = tree.find(p);
  if (o) {
    browser.directory(p, tree.get(o));
  } else {
    throw new Error(`Cannot find object in tree for this path: ${p}`);
  }
});

browser.on('file', (p) => {
  // console.log('You clicked on a file (%s)', p);

  const f = editor.get();

  // Save current file (if one is open) before opening new.
  if (f && f !== p) { editor.write(editor.get()); }

  editor.set(p);
  editor.read(p);
});

browser.directory('/', tree.show(activeProject));
browser.appendTo(document.querySelector('#tree'));

const watcher = chokidar.watch(activeProject, {
  ignored: /(^|[/\\])\../,
  persistent: true,
});

watcher.on('ready', () => {
  // Check if removed file is active in the editor
  // TODO: do something with editor when active file is removed
  watcher.on('unlink', (p) => {
    if (editor.get() === p) { editor.set(''); log('big problem'); }
  });

  watcher.on('all', ((e, p) => {
    // Update the document object tree
    tree.update(activeProject);

    // Re-render the changed directory (or the appropriate parent)
    // const o = tree.parent(p);
    // log(o);
    // if (o) {
    //   browser.directory(o, tree.get(o));
    // } else {
    //   throw new Error(`Cannot find object in tree for this path: ${p}`);
    // }
  }));
  watcher.on('error', error => log(`Watcher error: ${error}`));
});
