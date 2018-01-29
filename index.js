const settings = require('electron-settings')
const fs = require('fs')

const writeFile = function(data) {

  var path = settings.get('editor.path') + "new";

  fs.writeFile(path, data, function(e) {
    if(e)
      return console.log(e);
  })

}
