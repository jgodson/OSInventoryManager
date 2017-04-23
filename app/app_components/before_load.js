const fs = require('fs');
const path = require('path');
const app = require('electron').app;
const ISDEV = process.env.NODE_ENV === 'development';

// Dev or Production user data paths
const USER_DATA_PATH = ISDEV ? path.join(__dirname, '../data/app_data') : app.getPath('userData');
const FILE_NAME = 'settings_data.json'; 

console.log(path.join(USER_DATA_PATH, FILE_NAME));

// Check if settings exist. If not, create blank file
try {
  fs.statSync(path.join(USER_DATA_PATH, FILE_NAME));
} catch (e) {
  fs.writeFileSync(path.join(USER_DATA_PATH, FILE_NAME), "{}");
}
