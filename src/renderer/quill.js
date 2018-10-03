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
    quill.format('header', '1', Quill.sources.USER);
  },
  h2() {
    quill.format('header', '2', Quill.sources.USER);
  },
  h3() {
    quill.format('header', '3', Quill.sources.USER);
  },
  h4() {
    quill.format('header', '4', Quill.sources.USER);
  },
  h5() {
    quill.format('header', '5', Quill.sources.USER);
  },
  h6() {
    quill.format('header', '6', Quill.sources.USER);
  },
  bold() {
    quill.format('bold', !quill.getFormat().bold, Quill.sources.USER);
  },
  italic() {
    quill.format('italic', !quill.getFormat().italic, Quill.sources.USER);
  },
  underline() {
    quill.format('underline', !quill.getFormat().underline, Quill.sources.USER);
  },
  strikethrough() {
    quill.format('strike', !quill.getFormat().strike, Quill.sources.USER);
  },
  list() {
    quill.format('list', 'bullet', Quill.sources.USER);
  },
  orderedList() {
    quill.format('list', 'ordered', Quill.sources.USER);
  },
  quote() {
    quill.format('blockquote', !quill.getFormat().blockquote, Quill.sources.USER);
  },
  code() {
    quill.format('code', !quill.getFormat().code, Quill.sources.USER);
  },
  codeblock() {
    quill.format('code-block', !quill.getFormat()['code-block'], Quill.sources.USER);
  },
  superscript() {
    const result = quill.getFormat().script;
    if (result === 'super') {
      module.exports.clear();
    } else {
      quill.format('script', 'super', Quill.sources.USER);
    }
  },
  subscript() {
    const result = quill.getFormat().script;
    if (result === 'sub') {
      module.exports.clear();
    } else {
      quill.format('script', 'sub', Quill.sources.USER);
    }
  },
  indent() {
    quill.format('indent', '+1', Quill.sources.USER);
  },
  outdent() {
    quill.format('indent', '-1', Quill.sources.USER);
  },
  separator() {
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'separator', true, Quill.sources.USER);
    quill.setSelection(range.index + 2, Quill.sources.SILENT);
  },
  escape() {
    const format = quill.getFormat();
    Object.keys(format).forEach((key) => {
      quill.format(key, false, Quill.sources.USER);
    });
  },
  clear() {
    quill.removeFormat(quill.getSelection(), Quill.sources.USER);
  },
};
