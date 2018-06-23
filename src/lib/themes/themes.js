const Apollo11 = require('./Apollo11.js');
const Coal = require('./Coal.js');
const Lotus = require('./Lotus.js');
const Raspberry = require('./Raspberry.js');
const Swiss = require('./Swiss.js');

const themes = {
  Apollo11,
  Coal,
  Lotus,
  Raspberry,
  Swiss,
};

module.exports = {
  get(theme) {
    return themes[theme];
  },
};
