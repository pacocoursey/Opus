const Quill = require('quill');

// Define custom inline blot for find highlighting
const Inline = Quill.import('blots/inline');
class HighlightBlot extends Inline {}
HighlightBlot.blotName = 'highlight';
HighlightBlot.className = 'highlight';
HighlightBlot.tagName = 'hl';

// Custom embedded block blot for line separator
const Block = Quill.import('blots/block');
class HrBlot extends Block {}
HrBlot.blotName = 'separator';
HrBlot.tagName = 'hr';

// Register the blots
Quill.register(HighlightBlot);
Quill.register(HrBlot);

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
    this.quill.format('header', '1', Quill.sources.USER);
  },
  h2() {
    this.quill.format('header', '2', Quill.sources.USER);
  },
  h3() {
    this.quill.format('header', '3', Quill.sources.USER);
  },
  bold() {
    this.quill.format('bold', !this.quill.getFormat().bold, Quill.sources.USER);
  },
  italic() {
    this.quill.format('italic', !this.quill.getFormat().italic, Quill.sources.USER);
  },
  underline() {
    this.quill.format('underline', !this.quill.getFormat().underline, Quill.sources.USER);
  },
  strikethrough() {
    this.quill.format('strike', !this.quill.getFormat().strike, Quill.sources.USER);
  },
  list() {
    this.quill.format('list', 'bullet', Quill.sources.USER);
  },
  orderedList() {
    this.quill.format('list', 'ordered', Quill.sources.USER);
  },
  quote() {
    this.quill.format('blockquote', !this.quill.getFormat().blockquote, Quill.sources.USER);
  },
  code() {
    this.quill.format('code', !this.quill.getFormat().code, Quill.sources.USER);
  },
  codeblock() {
    this.quill.format('code-block', !this.quill.getFormat()['code-block'], Quill.sources.USER);
  },
  superscript() {
    const result = this.quill.getFormat().script;
    if (result === 'super') {
      module.exports.clear();
    } else {
      this.quill.format('script', 'super', Quill.sources.USER);
    }
  },
  subscript() {
    const result = this.quill.getFormat().script;
    if (result === 'sub') {
      module.exports.clear();
    } else {
      this.quill.format('script', 'sub', Quill.sources.USER);
    }
  },
  indent() {
    this.quill.format('indent', '+1', Quill.sources.USER);
  },
  outdent() {
    this.quill.format('indent', '-1', Quill.sources.USER);
  },
  separator() {
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'separator', true, Quill.sources.USER);
    quill.setSelection(range.index + 2, Quill.sources.SILENT);
  },
  clear() {
    this.quill.removeFormat(this.quill.getSelection(), Quill.sources.USER);
  },
};
