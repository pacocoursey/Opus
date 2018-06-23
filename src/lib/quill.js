const Quill = require('quill');

const quill = new Quill('.editor', {
  debug: 'error',
  theme: 'snow',
  modules: {
    history: {
      userOnly: true,
    },
  },
});

const sidebar = document.querySelector('aside');

module.exports = {
  init() {
    // Strikethrough
    quill.keyboard.addBinding({
      key: 'S',
      shiftKey: true,
      shortKey: true,
      handler(range, context) {
        this.quill.format('strike', !context.format.strike);
      },
    });

    // Heading 1
    quill.keyboard.addBinding({
      key: '1',
      shortKey: true,
      handler() {
        this.quill.format('header', '1');
      },
    });

    // Heading 2
    quill.keyboard.addBinding({
      key: '2',
      shortKey: true,
      handler() {
        this.quill.format('header', '2');
      },
    });

    // Heading 3
    quill.keyboard.addBinding({
      key: '3',
      shortKey: true,
      handler() {
        this.quill.format('header', '3');
      },
    });

    // Clear formatting
    quill.keyboard.addBinding({
      key: '0',
      shortKey: true,
      handler() {
        this.quill.removeFormat(this.quill.getSelection());
      },
    });

    // Ordered list
    quill.keyboard.addBinding({
      key: 'L',
      shortKey: true,
      handler() {
        this.quill.format('list', 'ordered');
      },
    });

    // Unordered list
    quill.keyboard.addBinding({
      key: 'L',
      shiftKey: true,
      shortKey: true,
      handler() {
        this.quill.format('list', 'bullet');
      },
    });

    // Subscript
    quill.keyboard.addBinding({
      key: 189, // -
      shiftKey: true,
      shortKey: true,
      handler() {
        this.quill.format('script', 'sub', true);
      },
    });

    // Superscript
    quill.keyboard.addBinding({
      key: 187, // =
      shiftKey: true,
      shortKey: true,
      handler() {
        this.quill.format('script', 'super', true);
      },
    });

    // Code-block
    quill.keyboard.addBinding({
      key: 'C',
      shiftKey: true,
      shortKey: true,
      handler(range, context) {
        this.quill.format('code-block', !context.format['code-block']);
      },
    });

    // Blockquote
    quill.keyboard.addBinding({
      key: 190, // .
      shortKey: true,
      handler(range, context) {
        this.quill.format('blockquote', !context.format.blockquote);
      },
    });

    // Indent
    quill.keyboard.addBinding({
      key: 221, // ]
      shortKey: true,
      handler() {
        this.quill.format('indent', '+1');
      },
    });

    // Outdent
    quill.keyboard.addBinding({
      key: 219, // ]
      shortKey: true,
      handler() {
        this.quill.format('indent', '-1');
      },
    });

    // Hide tree
    quill.keyboard.addBinding({
      key: 220, // \
      shortKey: true,
      handler() {
        if (sidebar.style.display === 'block') {
          sidebar.style.display = 'none';
        } else {
          sidebar.style.display = 'block';
        }
      },
    });

    // Automatically focus the editor
    quill.focus();
  },
  quill,
};
