const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const DB = require(`../${config.paths.data_folder}/db_actions`);
const User = require(`../${config.paths.models_folder}/user`);
const routes = require(`../${config.paths.components_folder}/routes`);

function handleNavigation(evt) {
  let action = $(evt.target).attr('href') || $(evt.target).parent().attr('href');
  action = action.replace(/\//g, '_');
  try {
    console.info(`[Route Called] ${action}`);
    routes[action].call();
  } catch (err) {
    routes.noRoute(action);
  }
}

function handleFormSubmit(formAction, formData) {
  console.log(formAction, formData);
}

function handleSearch(data) {
  console.log(data);
}
module.exports = {
  navigation: handleNavigation,
  form: handleFormSubmit
}