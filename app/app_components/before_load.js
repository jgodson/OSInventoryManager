const fs = require('fs');
const path = require('path');

// Check if settings exist. If not, create blank file
try {
  fs.statSync(path.join(__dirname, '../data/app_data/settings_data.json'));
} catch (e) {
  fs.writeFileSync(path.join(__dirname, '../data/app_data/settings_data.json'), "{}");
}
