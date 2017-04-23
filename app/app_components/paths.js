const app = require('electron').remote.app;
const path = require('path');
const ISDEV = process.env.NODE_ENV === 'development';

// Set the path for the app data (development or production)
let APP_DATA_PATH; 
let USER_DATA_PATH;
let APP_NAME = app.getName();
if (ISDEV) {
  APP_DATA_PATH = path.join(__dirname, `../${config.paths.app_data}`);
  USER_DATA_PATH = APP_DATA_PATH;
} else {
  APP_DATA_PATH = app.getPath('appData');
  USER_DATA_PATH = app.getPath('userData');
}

module.exports = {
  APP_DATA_PATH,
  USER_DATA_PATH
}
