const path = require('path');
const config = require(path.join(__dirname, 'app_config'));
const render = require(path.join(__dirname, `render`));
const appRoot = document.querySelector('#app-root');

render('index')
.then(html => {
  appRoot.innerHTML = html;
});
