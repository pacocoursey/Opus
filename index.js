const settings = require('electron-settings')
const fs = require('fs')
const path = require('path')
const dirtree = require('directory-tree')

fs.watch(settings.get('active.directory'), function (event, filename) {
    console.log('event is: ' + event);
    if (filename) {
        console.log('filename provided: ' + filename);
    } else {
        console.log('filename not provided');
    }
});

function updateSidebar() {
  var activePath = settings.get('active.directory')
  var sidebar = document.getElementsByClassName("sidebar")[0];

  var tree = dirtree(activePath, {extensions:/\.json/})

  document.getElementById("activeDirectory").innerHTML += path.basename(activePath)

  for(var i = 0; i < tree.children.length; i++) {
    var icon;

    if(tree.children[i].type === "directory")
      icon = "<i class='fas fa-folder'></i>"
    else if(tree.children[i].type === "file")
      icon = "<i class='far fa-file'></i>"

    var item = document.createElement("a")
    item.innerHTML = icon + tree.children[i].name;
    item.addEventListener("click", load)
    sidebar.appendChild(item)

  }

}

updateSidebar()

function load() {
  var activePath = settings.get('active.directory')
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
