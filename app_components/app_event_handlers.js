const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const User = require(`../${config.paths.models_folder}/user`);
const routes = require(`../${config.paths.components_folder}/routes`);

function handleNavigation(evt) {
  evt.preventDefault();
  var action = $(this).attr('href').replace('/', '');
  console.log(action);
  try {
    routes[action].call();
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  handleNavigation: handleNavigation
}