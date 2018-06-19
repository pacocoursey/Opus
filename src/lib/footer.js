const footer = document.querySelector('#footer');

module.exports = {
  update(line, char, selection) {
    if (!selection) {
      footer.innerHTML = `${line}:${char}`;
    } else {
      footer.innerHTML = `${line}:${char} <b>[${selection.lines}:${selection.chars}]</b>`;
    }
  },
};
