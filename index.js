const settings = require('electron-settings')
const fs = require('fs')
const path = require('path')

const writeFile = function(data) {

  var current_file = settings.get('default.directory') + "new"

  fs.writeFile(current_file, data, function(e) {
    if(e)
      return console.log(e)
  })

}

// Automatically populate sidebar
var opus_path = settings.get('default.directory')

fs.readdir(opus_path, function(err, items) {
  var sidebar = document.getElementsByClassName("sidebar")[0]

  var folder = document.createElement("H3")
  var folder_name = document.createTextNode(path.basename(opus_path))
  folder.appendChild(folder_name)
  sidebar.appendChild(folder)

  for(var i = 0;i < items.length; i++) {
    var file = document.createElement("P")
    var file_name = document.createTextNode(items[i])
    file.appendChild(file_name)
    sidebar.appendChild(file)
    // console.log(items[i]);
  }
})
