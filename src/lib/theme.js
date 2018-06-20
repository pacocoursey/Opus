const style = document.createElement('style');
const def = {
  meta: {},
  data: {
    background: '#222',
    f_high: '#fff',
    f_med: '#777',
    f_low: '#444',
    f_inv: '#000',
    b_high: '#000',
    b_med: '#affec7',
    b_low: '#000',
    b_inv: '#affec7',
  },
};
let active = def;

style.type = 'text/css';

const isJSON = (text) => {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  init() {
    this.def = def;
    module.exports.load(localStorage.theme ? localStorage.theme : def, def);
    window.addEventListener('dragover', module.exports.dragEnter);
    window.addEventListener('drop', module.exports.drag);
    document.head.appendChild(style);
  },
  load(t, fallback) {
    this.active = active;
    let theme = isJSON(t) ? JSON.parse(t).data : t.data;

    if (!theme || !theme.background) {
      if (fallback) { theme = fallback.data; } else { return; }
    }

    const css = `
    :root {
      --background: ${theme.background};
      --f_high: ${theme.f_high};
      --f_med: ${theme.f_med};
      --f_low: ${theme.f_low};
      --f_inv: ${theme.f_inv};
      --b_high: ${theme.b_high};
      --b_med: ${theme.b_med};
      --b_low: ${theme.b_low};
      --b_inv: ${theme.b_inv};
    }`;

    active = theme;
    style.textContent = css;
    localStorage.setItem('theme', JSON.stringify({ data: theme }));
  },
  reset() {
    this.def = def;
    module.exports.load(def);
  },
  dragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  },
  drag(e) {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];

    if (!file.name || !file.name.indexOf('.thm') < 0) { console.log('Theme', 'Not a theme'); return; }

    const reader = new FileReader();
    reader.onload = (event) => {
      module.exports.load(event.target.result);
    };
    reader.readAsText(file);
  },
};
