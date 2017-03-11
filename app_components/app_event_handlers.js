const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const DB = require(`../${config.paths.data_folder}/db_actions`);
const User = require(`../${config.paths.models_folder}/user`);
const routes = require(`../${config.paths.components_folder}/routes`);

function handleNavigation(evt) {
  evt.preventDefault();
  var action = $(this).attr('href').replace('/', '');
  console.info(`[Route Called] ${action}`);
  if (typeof routes[action] === 'function') {
    routes[action].call();
  } else {
    console.warn(`[Missing Route] ${action}`);
  }
}

module.exports = {
  handleNavigation: handleNavigation
}