const settings = require('electron').remote.require('electron-settings')
const fs = require('fs')
const path = require('path')
const dirtree = require('directory-tree')
const watch = require('node-watch')

watch(settings.get('active.project'),
  {
    recursive: true,
    filter: /\.json$/
  }, function(evt, name) {
    console.log(evt)
    if(evt == 'update' || evt == 'remove') {
      // created, modified, or deleted
      reloadProject(name)
      console.log("Reloading sidebar project view.")
    }
})

const getDirectories = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory())
const getFiles = p => fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isFile() && path.extname(f) === ".json")

// parentList is the <ol> the function should populate into
const printFolder = function(name, path, parentList) {
  var li = document.createElement("li")
  var div = document.createElement("div")
  var indicator = document.createElement("i")
  var icon = document.createElement("i")
  var span = document.createElement("span")
  var ol = document.createElement("ol")

  div.classList.add("folder")
  div.addEventListener("click", folder)
  indicator.classList.add("fas")
  indicator.classList.add("fa-fw")
  indicator.classList.add("fa-angle-right")
  icon.classList.add("fas")
  icon.classList.add("fa-fw")
  icon.classList.add("fa-folder")
  span.setAttribute("data-path", path + "/")
  span.setAttribute("data-name", name)
  span.innerHTML = name

  div.appendChild(indicator)
  div.appendChild(icon)
  div.appendChild(span)
  li.appendChild(div)
  li.appendChild(ol)

  parentList.appendChild(li)
}

// parentList is the <ol> the function should append to
const printFile = function(name, path, parentList) {
  var li = document.createElement("li")
  var div = document.createElement("div")
  var icon = document.createElement("i")
  var span = document.createElement("span")

  div.classList.add("file")
  div.addEventListener("click", load)
  icon.classList.add("far")
  icon.classList.add("fa-fw")
  icon.classList.add("fa-file")
  span.setAttribute("data-path", path)
  span.setAttribute("data-name", name)
  span.innerHTML = name

  div.appendChild(icon)
  div.appendChild(span)
  li.appendChild(div)

  parentList.appendChild(li)
}

const openProject = function() {
  var projectPath = settings.get('active.project')
  var projectName = path.basename(projectPath)
  var span = document.getElementById("projectRoot")

  span.setAttribute("data-path", projectPath)
  span.setAttribute("data-name", projectName)
  span.innerHTML = projectName

  openFolder(projectPath)
}

const reloadProject = function(filePath) {
  var parentFolderPath = path.dirname(filePath) + "/"
  var parentFolder = document.querySelectorAll('[data-path="' + parentFolderPath + '"]').item(0).parentElement
  var ol = parentFolder.nextElementSibling
  var openFolders = ol.getElementsByClassName("folder open")
  var paths = new Array()
  var folder, folderPath

  // statically save the paths of open folders
  for(folder of openFolders) {
    paths.push(folder.childNodes[2].getAttribute("data-path"))
  }

  console.log(parentFolderPath)

  closeFolder(parentFolderPath)
  openFolder(parentFolderPath)

  for(folderPath of paths) {
    openFolder(folderPath)
  }

}

const closeFolder = function(path) {
  var folder = document.querySelectorAll('[data-path="' + path + '"]').item(0).parentElement
  var indicator = folder.childNodes[0]
  var ol = folder.nextElementSibling

  indicator.classList.remove("fa-angle-down")
  indicator.classList.add("fa-angle-right")

  folder.classList.remove("open")

  ol.innerHTML = ""
}

const openFolder = function(path) {
  var dirs = getDirectories(path)
  var files = getFiles(path)

  var folder = document.querySelectorAll('[data-path="' + path + '"]').item(0).parentElement
  var indicator = folder.childNodes[0]
  console.log(folder)
  var ol = folder.nextElementSibling
  folder.classList.add("open")

  var i, name, dataPath

  indicator.classList.remove("fa-angle-right")
  indicator.classList.add("fa-angle-down")

  for(i = 0; i < dirs.length; i++) {
    name = dirs[i]
    dataPath = path + name
    printFolder(name, dataPath, ol)
  }

  for(i = 0; i < files.length; i++) {
    name = files[i]
    dataPath = path + name
    printFile(name, dataPath, ol)
  }
}

const folder = function() {
  var path = this.childNodes[2].getAttribute("data-path")
  var indicator = this.childNodes[0]

  var status = 0

  if(this.classList.contains("open")) {
    closeFolder(path)
  } else {
    openFolder(path)
  }
}

const load = function() {
  var path = this.childNodes[1].getAttribute("data-path")
  var current = document.getElementsByClassName("active")

  if(current.length > 0)
    current[0].classList.remove("active")

  this.classList.add("active")

  settings.set('active.file', path)

  loadFile(path)
}

const writeFile = function(data) {
  var activeFile = settings.get('active.file')

  fs.writeFile(activeFile, data, function(e) {
    if(e)
      return console.log(e)
  })

}


// Boot it up
openProject()









// space
