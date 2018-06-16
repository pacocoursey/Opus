const chokidar = require('chokidar');
const Tree = require('./lib/tree.js');
const treeView = require('tree-view');

// const activeFile = '/Users/paco/Dropbox/school/opus/new.json';
const activeProject = '/Users/paco/Dropbox/school/opus/';
// TODO remove this
const log = console.log.bind(console);

// Setup the document tree
const tree = Tree.createTree(activeProject);

const browser = treeView();
browser.on('directory', (p) => {
  console.log('You clicked on a directory (%s)', p);

  // TODO error check that find returns !false
  const o = tree.find(p);
  browser.directory(p, tree.get(o));
});

browser.on('file', (p) => {
  console.log('You clicked on a file (%s)', p);

  // TODO editor.readFile
});

browser.directory('/', tree.show(activeProject));

browser.appendTo(document.body);

const watcher = chokidar.watch(activeProject, {
  ignored: /(^|[/\\])\../,
  persistent: true,
});

// TODO re-render the appropriate sections on change

watcher.on('ready', () => {
  watcher.on('all', () => tree.update(activeProject));
  watcher.on('error', error => log(`Watcher error: ${error}`));
});
