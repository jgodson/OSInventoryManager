const path = require('path');
const config = require(path.join(__dirname, 'app_config'));

// Global app settings will be available in any template rendered
const settings = require(`../${config.paths.config_folder}/settings_data.json`);

// Add the app config settings to the global settings object
settings.config = config;

// Set up folders for liquid files
const f_css = `${config.liquid_css_folder}`

const Liquid = require('shopify-liquid');
const engine = Liquid({
  root: [path.resolve(__dirname, `../${config.paths.templates_folder}`),
    path.resolve(__dirname, `../${config.paths.snippets_folder}`),
    path.resolve(__dirname, `../${config.paths.liquid_css_folder}`)],  // dirs to lookup layouts/includes
  extname: '.liquid' // the default extname used for layouts/includes
});

// File specific options can be passed in as a second argument when calling this
function render(fileName, options) {
  // Return a promise with a catch all error handler
  return engine.renderFile(fileName, { settings: settings, options: options, template: fileName })
    .catch(error => {
      console.error(error);
    });
}

module.exports = render;