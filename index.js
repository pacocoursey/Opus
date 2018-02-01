const settings = require('electron-settings')
const fs = require('fs')
const path = require('path')

const writeFile = function(path, data) {

  var current_file = settings.get('current.file')

  console.log("Saving: " + current_file)

  // fs.writeFile(current_file, data, function(e) {
  //   if(e)
  //     return console.log(e)
  // })

}

// Automatically populate sidebar
var opus_path = settings.get('default.directory')

fs.readdir(opus_path, function(err, items) {

  // Output working directory
  var sidebar = document.getElementsByClassName("sidebar")[0]
  var project_root_path = path.basename(opus_path)
  document.getElementById("project_root").innerHTML += project_root_path;

  // Loop through files in working directory
  for(var i = 0;i < items.length; i++) {

    // Output file
    var file = document.createElement("a")
    file.innerHTML = "<i class='fa fa-file'></i>" + items[i]

    file.addEventListener("click", function() {
      load(this.innerHTML)
    })

    sidebar.appendChild(file)
  }
})

function load(path) {
  console.log("load() hit: " + path)
}










// space
