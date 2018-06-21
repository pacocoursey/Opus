const footer = document.querySelector('#footer');

module.exports = {
  update(line, char, selection) {
    if (!selection) {
      footer.children[0].innerHTML = `${line}:${char}`;
    } else {
      footer.children[0].innerHTML = `${line}:${char} <b>[${selection.lines}:${selection.chars}]</b>`;
    }
  },
  setFile(name) {
    footer.children[1].innerHTML = `${name}`;
  },
  hasChanges() {
    footer.children[1].classList.add('unsaved');
  },
  noChanges() {
    footer.children[1].classList.remove('unsaved');
  },
};
