const settings = require('electron-settings');
const path = require('path');
const watch = require('node-watch');
const fs = require('fs');
const editor = require('./lib/editor.js');

watch(
  settings.get('active.project'),
  {
    recursive: true,
    filter: /\.json$/,
  }, (evt, name) => {
    if (evt === 'update' || evt === 'remove') {
      // created, modified, or deleted
      console.log('Reloading.');
      reloadProject(name);
    }
  },
);

const getDirectories = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory());
const getFiles = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isFile() && path.extname(f) === '.json');

// parentList is the <ol> the function should populate into
const printFolder = (name, folderPath, parentList) => {
  const li = document.createElement('li');
  const div = document.createElement('div');
  const indicator = document.createElement('i');
  const icon = document.createElement('i');
  const span = document.createElement('span');
  const ol = document.createElement('ol');

  div.classList.add('folder');
  div.addEventListener('click', folder);
  indicator.classList.add('fas');
  indicator.classList.add('fa-fw');
  indicator.classList.add('fa-angle-right');
  icon.classList.add('fas');
  icon.classList.add('fa-fw');
  icon.classList.add('fa-folder');
  span.setAttribute('data-path', `${folderPath}/`);
  span.setAttribute('data-name', name);
  span.innerHTML = name;

  div.appendChild(indicator);
  div.appendChild(icon);
  div.appendChild(span);
  li.appendChild(div);
  li.appendChild(ol);

  parentList.appendChild(li);
};

// parentList is the <ol> the function should append to
const printFile = (name, filePath, parentList) => {
  const li = document.createElement('li');
  const div = document.createElement('div');
  const icon = document.createElement('i');
  const span = document.createElement('span');

  div.classList.add('file');
  div.addEventListener('click', load);
  icon.classList.add('far');
  icon.classList.add('fa-fw');
  icon.classList.add('fa-file');
  span.setAttribute('data-path', filePath);
  span.setAttribute('data-name', name);
  span.innerHTML = name;

  div.appendChild(icon);
  div.appendChild(span);
  li.appendChild(div);

  parentList.appendChild(li);
};

const openProject = function openProject() {
  const projectPath = settings.get('active.project');
  const projectName = path.basename(projectPath);
  const span = document.getElementById('projectRoot');

  span.setAttribute('data-path', projectPath);
  span.setAttribute('data-name', projectName);
  span.innerHTML = projectName;

  openFolder(projectPath);
};

const reloadProject = function reloadProject(filePath) {
  const parentFolderPath = `${path.dirname(filePath)}/`;
  const parentFolder = document.querySelectorAll(`[data-path="${parentFolderPath}"]`).item(0).parentElement;
  const ol = parentFolder.nextElementSibling;
  const openFolders = ol.getElementsByClassName('folder open');
  const paths = [];
  const activeFilePath = document.getElementsByClassName('active')[0].children[1].getAttribute('data-path');
  let folder;
  let folderPath;

  // statically save the paths of open folders
  for (folder of openFolders) { paths.push(folder.childNodes[2].getAttribute('data-path')); }

  closeFolder(parentFolderPath);
  openFolder(parentFolderPath);

  for (folderPath of paths) {
    openFolder(folderPath);
  }

  // save the active file
  document.querySelectorAll(`[data-path="${activeFilePath}"]`).item(0).parentElement.classList.add('active');
};

const closeFolder = function closeFolder(path) {
  const folder = document.querySelectorAll(`[data-path="${path}"]`).item(0).parentElement;
  const indicator = folder.children[0];
  const ol = folder.nextElementSibling;

  indicator.classList.remove('fa-angle-down');
  indicator.classList.add('fa-angle-right');

  folder.classList.remove('open');

  ol.innerHTML = '';
};

const openFolder = function openFolder(path) {
  const dirs = getDirectories(path);
  const files = getFiles(path);

  const folder = document.querySelectorAll(`[data-path="${path}"]`).item(0).parentElement;
  const indicator = folder.children[0];
  const ol = folder.nextElementSibling;
  folder.classList.add('open');

  let i;
  let name;
  let dataPath;

  indicator.classList.remove('fa-angle-right');
  indicator.classList.add('fa-angle-down');

  for (i = 0; i < dirs.length; i += 1) {
    name = dirs[i];
    dataPath = path + name;
    printFolder(name, dataPath, ol);
  }

  for (i = 0; i < files.length; i += 1) {
    name = files[i];
    dataPath = path + name;
    printFile(name, dataPath, ol);
  }
};

const folder = function folder() {
  const path = this.childNodes[2].getAttribute('data-path');

  if (this.classList.contains('open')) {
    closeFolder(path);
  } else {
    openFolder(path);
  }
};

const load = function load() {
  const path = this.childNodes[1].getAttribute('data-path');
  const current = document.getElementsByClassName('active');

  if (current.length > 0) { current[0].classList.remove('active'); }

  this.classList.add('active');

  settings.set('active.file', path);

  editor.readFile(path);
};




// Boot it up
openProject();
