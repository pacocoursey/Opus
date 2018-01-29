var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

var quill = new Quill('.editor', {

  modules: {
    toolbar: toolbarOptions
  },

  debug: 'info',
  placeholder: 'Begin your opus...',
  theme: 'snow'
});


var Delta = Quill.import('delta');

function loadFile() {
  // Load Delta content from file
  var contents = fs.readFileSync('/Users/paco/Dropbox/school/opus/new').toString();

  var load = new Delta(JSON.parse(contents));

  quill.setContents(load, "user");
}

// Set a flag on text-change event.
var change = false;
quill.on('text-change', function(delta) {
  change = true;
});

// Every second, monitor the text-change flag
// If true, save the entire file locally.
setInterval(function() {
  if(change) {
    console.log("Saving file.");

    writeFile(JSON.stringify(quill.getContents()));

    change = false;
  }
}, 1000);

// Check for unsaved data
window.onbeforeunload = function() {
  if (change) {
    return 'There are unsaved changes. Are you sure you want to leave?';
  }
}
