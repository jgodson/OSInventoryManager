const config = require('./app_config');
const render = require(path.join(__dirname, `render`));

const routes = {
  index: () => {
    handleNavRoute('index');
  },
  settings: () => {
    handleNavRoute('settings');
  },
  customers: () => {
    handleNavRoute('customers');
  }
}

function handleNavRoute(templateName) {
  render(templateName)
      .then(html => visualizer.emit('rendercomplete', html));
}

module.exports = routes;