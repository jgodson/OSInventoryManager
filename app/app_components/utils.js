const path = require('path');
const config = require(path.join(__dirname, 'app_config'));
const settingsSchema = require(`../${config.paths.config_folder}/settings_schema.json`);

function getDefaultSettings() {
  let defaults = {};
  for (const setting of settingsSchema) {
    let namespace = setting.name;
    setting.settings.forEach((item)=> {
      if (item.default !== undefined) {
        if (typeof defaults[namespace] !== 'object') {
          defaults[namespace] = {};
        }
        defaults[namespace][item.id] = item.default;
      }
    });
  }
  return defaults;
}

module.exports = {
  getDefaultSettings
}