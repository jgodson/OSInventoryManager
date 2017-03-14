const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const DB = require(`../${config.paths.data_folder}/db_actions`);
const User = require(`../${config.paths.models_folder}/user`);
const routes = require(`../${config.paths.components_folder}/routes`);

// Track logged in User
let currentUser = undefined;

function handleNavigation(evt) {
  const startTime = Date.now();
  let action = $(evt.target).attr('href') || $(evt.target).parent().attr('href');
  action = replaceSlash(action);
    console.info(`[Route Called] ${action}`);
    if (typeof routes[action] === 'function') {
      routes[action]()
        .then(() => {
          const endTime = Date.now();
          console.info(`[Route Success] ${action} took ${endTime - startTime}ms`);
        })
        .catch(err => {
          console.warn(err);
        });
    } else {
      routes.noRoute(action);
    }
}

function handleFormSubmit(formAction, formData) {
  formAction = replaceSlash(formAction);
    console.info(`[Form Submit] ${formAction}`);
  if (typeof routes.forms[formAction] === 'function') {
    routes.forms[formAction](formData);
  } else {
    routes.noRoute(formAction);
  }
}

function handleLogIn() {
  // TODO: Add to currentUser variable
}

// Log out user and return to dashboard
function handleLogOut() {
  currentUser == undefined;
  routes['index']()
    .then(() => {
      console.info(`[Log Out Success] Succesfully Logged Out`);
    })
    .catch(err => {
      console.warn(err);
    });
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