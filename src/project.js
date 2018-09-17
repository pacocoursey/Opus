module.exports = {
  new(path) {
    return {
      path,
      hasChanges: false,
      isSlid: false,
      theme: false,
      activeFile: undefined,
      tree: undefined,
      window: undefined,
    };
  },
};
