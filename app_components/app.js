const config = require('../config/config.json');
const render = require(`./render`);

render('template')
  .then(html => {
    document.write(html);
  });
