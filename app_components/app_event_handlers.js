const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const DB = require(`../${config.paths.data_folder}/db_actions`);
const remote = require('electron').remote;
const User = require(`../${config.paths.models_folder}/user`);
const routes = require(`../${config.paths.components_folder}/routes`);
const render = require(path.join(__dirname, `render`));
const file = require(path.join(__dirname, 'file_writer'));

// Track logged in User
let currentUser = undefined;

// Increment every time a notification is shown to keep the number unique
let NotificationID = 0;

// Call routes to handle navigation
function navigateTo(evt) {
  const startTime = Date.now();
  let action = $(evt.target).attr('href') || $(evt.target).parent().attr('href');
  action = replaceSlash(action);
  console.info(`[Route Called] ${action}`);
  if (typeof routes[action] === 'function') {
    // TODO: ensure user has permission for route
    routes[action]()
      .then(() => {
        const endTime = Date.now();
        console.info(`[Route Success] ${action} took ${endTime - startTime}ms`);
      })
      .catch(err => {
        // Called when already trying to navigate to current page
        console.info(err);
      });
    } else {
      routes.noRoute(action);
    }
}

// Handle form actions here
function formSubmit(formAction, formData) {
  formAction = replaceSlash(formAction);
  console.info(`[Form Submit] ${formAction}`);
    // handle account actions here
  if (typeof formActions[formAction] === 'function') {
    formActions[formAction](formData);
  } else {
    routes.noRoute(formAction);
  }
}

function showNotification(details = {}) {
  details.id = ++NotificationID;
  details.layout = false; // Don't render normal layout file
  render('notification', details)
    .then((html)=> {
      Notifier.emit('rendered-notification', html, details.id);
    }).catch((err)=> {
      console.error(`[Render Error] ${err}`);
    });
}

formActions = {
  settings_save(formData) {
    // Name of settings data file
    const fileName = 'settings_data.json';
    file.writeData(fileName, formData)
      .then(()=> {
        // Have to reload window for file changes to take effect
        Notifier.emit('show-notification', {
          allow_hide: false,
          type: "success",
          timeout: 4500,
          icon: "sync_problem",
          title: "Settings Saved Successfully!",
          message: `In order for new settings to take effect, the app must be reloaded.<br/>
            This will happen automatically in 5 seconds.`
        });

        // Reload after 5 seconds
        setTimeout(()=> {
          remote.getCurrentWindow().reload();
        }, 5000);
      })
      .catch((e)=> {

      });
  },
  login(formData) {
    // TODO find user and set currentUser to that user. Redirect to index
  },
  search(formData) {
    // TODO: Do something
  },
  logOut() {
    // Log out user and return to dashboard
    currentUser == undefined;
    console.info(`[Log Out Success] Succesfully Logged Out`);
    routes['index']()
      .catch(err => {
        console.warn(err);
      });
  }
}

// <---- Helper Functions ----->
function replaceSlash(action) {
  return action.replace(/\//g, '_');
}

function noPermisions(action) {
  console.warn(`[Access Denied]  ${currentUser.username} does not have permission for ${action}`);
}

// <---- Module Exports ----->
module.exports = {
  navigateTo,
  formSubmit,
  notification: {
    show: showNotification
  }
}