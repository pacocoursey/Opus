const settings = require('electron').remote.require('electron-settings');
const fs = require('fs')
const path = require('path')
const dirtree = require('directory-tree')

const getDirectories = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory())

const getFiles = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isFile())




// fs.watch(settings.get('active.directory'), function (event, filename) {
//     console.log('event is: ' + event);
//     if (filename) {
//         console.log('filename provided: ' + filename);
//     } else {
//         console.log('filename not provided');
//     }
// });

// initialize project root folder: populate OL
//   folders first, collapsed
//   files
//
// on folder click: populate folder OL
//   folders first, collapsed
//   files

// console.log(settings.get('active.project'))

const printFolder = function(name, path, list) {
  var li = document.createElement("li")
  var div = document.createElement("div")
  var indicator = document.createElement("i")
  var icon = document.createElement("i")

  div.classList.add("folder")
  indicator.classList.add("fas fa-angle-right")
  icon.classList.add("fas fa-folder")
}

const printFile = function(name, path, list) {

}

const openFolder = function(path) {
  var dirs = getDirectories(path)
  var files = getFiles(path)

  var folder = document.querySelectorAll("[data-path=" + path + "]")
  var ol = folder.nextSibling

  var i, name, dataPath;

  for(i = 0; i < dirs.length; i++) {
    name = dirs[i];
    dataPath = path + name;
    printFolder(name, dataPath, ol)
  }

  for(i = 0; i < files.length; i++) {
    name = files[i];
    dataPath = path + name;
    printFile(name, dataPath, ol)
  }


}

function updateSidebar(directoryPath) {
  var activeProjectPath = settings.get('active.project')
  var sidebar = document.getElementsByClassName("sidebar")[0];

  var dirs = getDirectories(activeProjectPath)
  var files = getFiles(activeProjectPath)

  document.getElementById("activeProject").innerHTML += path.basename(activeProjectPath)

  var icon, item;

  for(var i = 0; i < dirs.length; i++) {
    item = document.createElement("a")
    icon = "<i class='fas fa-angle-right folder-indicator'></i><i class='fas fa-folder'></i>"

    item.innerHTML = icon + dirs[i];
    item.classList.add("folder")
    item.addEventListener("click", folder)
    sidebar.appendChild(item)
  }

  for(var i = 0; i < files.length; i++) {
    item = document.createElement("a")
    icon = "<i class='far fa-file'></i>"

    item.classList.add("file")
    item.innerHTML = icon + files[i];
    item.addEventListener("click", load)
    sidebar.appendChild(item)
  }

}

// updateSidebar()

function folder() {
  console.log("open/close this folder")
}

function load() {
  var activePath = settings.get('active.project')
  var name = this.innerHTML.replace(/<(?:.|\n)*?>/gm, '');
  var fileName = activePath + name;

  var current = document.getElementsByClassName("active")
  if(current.length > 0)
    current[0].classList.remove("active")

  this.classList = "active";

  settings.set('active.file', fileName)

  loadFile(fileName);
}

const writeFile = function(data) {
  var activeFile = settings.get('active.file')

  fs.writeFile(activeFile, data, function(e) {
    if(e)
      return console.log(e)
  })

}









// space
