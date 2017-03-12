const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const DB = require(`../${config.paths.data_folder}/db_actions`);
const User = require(`../${config.paths.models_folder}/user`);
const routes = require(`../${config.paths.components_folder}/routes`);

function handleNavigation(evt) {
  var action = $(evt.target).attr('href') || $(evt.target).parent().attr('href');
  console.info(`[Route Called] ${action}`);
  if (typeof routes[action] === 'function') {
    routes[action].call();
  } else {
    routes.noRoute(action);
  }
}

module.exports = {
  navigation: handleNavigation
}