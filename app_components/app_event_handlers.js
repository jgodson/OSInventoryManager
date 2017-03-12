const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const DB = require(`../${config.paths.data_folder}/db_actions`);
const User = require(`../${config.paths.models_folder}/user`);
const routes = require(`../${config.paths.components_folder}/routes`);

function handleNavigation(evt) {
  let action = $(evt.target).attr('href') || $(evt.target).parent().attr('href');
  action = replaceSlash(action);
  try {
    console.info(`[Route Called] ${action}`);
    routes[action]();
  } catch (err) {
    routes.noRoute(action);
  }
}

function handleFormSubmit(formAction, formData) {
  formAction = replaceSlash(formAction);
  try {
    console.info(`[Form Submit] ${formAction}`);
    routes.forms[formAction](formData)
  } catch (err) {
    routes.noRoute(formAction);
  }
}

function replaceSlash(action) {
  return action.replace(/\//g, '_');
}

function handleSearch(data) {
  console.log(data);
}
module.exports = {
  navigation: handleNavigation,
  form: handleFormSubmit
}