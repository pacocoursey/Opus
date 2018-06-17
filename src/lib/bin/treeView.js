const path = require('path');
const react = require('react');
const events = require('events');

const { DOM } = react;

const folder = DOM.i({ className: 'fas fa-fw fa-folder' });
const project = DOM.i({ className: 'fas fa-fw fa-book' });
const arrowClosed = DOM.i({ className: 'fas fa-fw fa-angle-right' });
const arrowOpen = DOM.i({ className: 'fas fa-fw fa-angle-down' });
const file = DOM.i({ className: 'far fa-fw fa-file' });

const Browser = react.createClass({
  getInitialState() {
    return { root: {} };
  },
  renderDirectory(dir) {
    const self = this;
    const entries = this.state.root[dir];

    if (!entries) return DOM.ul(null);

    const list = entries.map((e) => {
      const name = path.basename(e.path);
      const open = self.state.root[e.path];
      const isRoot = e.root;

      const onclick = () => {
        if (e.type !== 'directory') self.props.onfile(e);
        else if (open) self.props.onclose(e);
        else self.props.onopen(e);
      };

      let icons;
      if (isRoot && !open) icons = { arrowClosed, project };
      else if (isRoot && open) icons = { arrowOpen, project };
      else if (e.type !== 'directory' && !isRoot) icons = file;
      else if (e.type === 'directory' && !open) icons = { arrowClosed, folder };
      else icons = { arrowOpen, folder };

      const item = DOM.div({
        className: 'list-item',
        onClick: onclick,
      }, DOM.span({
        className: 'name',
      }, icons, name));

      if (e.type !== 'directory') {
        return DOM.li({
          key: e.path,
          className: 'entry file',
        }, item);
      }

      if (!open) {
        return DOM.li({
          key: e.path,
          className: 'entry directory',
        }, item);
      }

      return DOM.li({
        key: e.path,
        className: 'entry directory',
      }, item, self.renderDirectory(e.path));
    });

    return DOM.ul(null, list);
  },
  render() {
    return DOM.div(
      { className: 'tree-view' },
      this.renderDirectory('/', 0),
    );
  },
});

module.exports = () => {
  const that = new events.EventEmitter();
  const root = {};
  let comp;

  const onfile = (e) => {
    that.emit('file', e.path, e);
  };

  const onopen = (e) => {
    that.emit('directory', e.path, e);
  };

  const onclose = (e) => {
    delete root[e.path];
    Object.keys(root).forEach((p) => {
      if (path.join(p, '/').indexOf(path.join(e.path, '/')) === 0) delete root[p];
    });
    if (comp) comp.setState({ root });
  };

  that.directory = (cwd, entries) => {
    root[cwd] = entries;
    if (comp) comp.setState({ root });
  };

  that.directories = root;

  that.appendTo = (el) => {
    let element = el;
    if (typeof element === 'string') { element = document.querySelector(el); }
    comp = react.renderComponent(Browser({ onopen, onclose, onfile }), el);
    comp.setState({ root });
  };

  return that;
};
