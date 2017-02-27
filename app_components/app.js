const config = require('./app_config');
const render = require(`./render`);
const appRoot = document.querySelector('#app-root');

render('template', {name: "Jason"})
  .then(html => {
    appRoot.innerHTML = html;
  });
