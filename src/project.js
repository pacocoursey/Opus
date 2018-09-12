class Project {
  constructor(path) {
    this.path = path;
    this.hasChanges = false;
    this.isSlid = false;
    this.theme = false;
    this.activeFile = undefined;
    this.tree = undefined;
    this.window = undefined;
  }
}

module.exports = Project;
