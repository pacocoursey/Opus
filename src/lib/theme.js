const style = document.createElement('style');
const def = {
  meta: {},
  data: {
    background: '#161616',
    f_high: '#f0c098',
    f_med: '#999999',
    f_low: '#555555',
    f_inv: '#222222',
    b_high: '#ffffff',
    b_med: '#333333',
    b_low: '#000000',
    b_inv: '#f0c098',
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
};
