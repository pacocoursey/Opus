const Quill = require('quill');

// Define custom inline blot for find highlighting
const Inline = Quill.import('blots/inline');
class HighlightBlot extends Inline {
  static create() {
    const node = super.create();
    node.classList.add('highlight');
    node.style.backgroundColor = 'var(--select)';
    node.style.color = '#fff';
    node.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
    return node;
  }
}

HighlightBlot.blotName = 'highlight';
HighlightBlot.tagName = 'span';
Quill.register(HighlightBlot);


// Initialize the editor
const quill = new Quill('.editor', {
  debug: 'error',
  theme: 'snow',
  modules: {
    history: {
      userOnly: true,
    },
  },
});

module.exports = {
  init() {
    // Automatically focus the editor
    quill.focus();
  },
  quill,
  h1() {
    this.quill.format('header', '1', 'user');
  },
  h2() {
    this.quill.format('header', '2', 'user');
  },
  h3() {
    this.quill.format('header', '3', 'user');
  },
  bold() {
    this.quill.format('bold', !this.quill.getFormat().bold, 'user');
  },
  italic() {
    this.quill.format('italic', !this.quill.getFormat().italic, 'user');
  },
  underline() {
    this.quill.format('underline', !this.quill.getFormat().underline, 'user');
  },
  strikethrough() {
    this.quill.format('strike', !this.quill.getFormat().strike, 'user');
  },
  list() {
    this.quill.format('list', 'bullet', 'user');
  },
  orderedList() {
    this.quill.format('list', 'ordered', 'user');
  },
  quote() {
    this.quill.format('blockquote', !this.quill.getFormat().blockquote, 'user');
  },
  code() {
    this.quill.format('code', !this.quill.getFormat().code, 'user');
  },
  codeblock() {
    this.quill.format('code-block', !this.quill.getFormat()['code-block'], 'user');
  },
  superscript() {
    const result = this.quill.getFormat().script;
    if (result === 'super') {
      module.exports.clear();
    } else {
      this.quill.format('script', 'super', 'user');
    }
  },
  subscript() {
    const result = this.quill.getFormat().script;
    if (result === 'sub') {
      module.exports.clear();
    } else {
      this.quill.format('script', 'sub', 'user');
    }
  },
  indent() {
    this.quill.format('indent', '+1', 'user');
  },
  outdent() {
    this.quill.format('indent', '-1', 'user');
  },
  clear() {
    this.quill.removeFormat(this.quill.getSelection(), 'user');
  },
};
