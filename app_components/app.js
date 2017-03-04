const config = require('./app_config');
const render = require(`./render`);
const appRoot = document.querySelector('#app-root');

render('index')
.then(html => {
  appRoot.innerHTML = html;
});
