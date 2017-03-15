const path = require('path');
const config = require(path.join(__dirname, 'app_config'));
const utils = require(path.join(__dirname, 'utils'));
const jQuery = require('jQuery');

// Global app settings will be available in any template rendered
// If settings aren't present, defaults are used
const settings = require(`../${config.paths.app_data}/settings_data.json`);
const defaultSettings = utils.getDefaultSettings();
const mergedSettings = {};
jQuery.extend(true, mergedSettings, defaultSettings, settings);

// Set up folders for liquid files
const folders = {
  templates: path.resolve(__dirname, `../${config.paths.templates_folder}`),
  css: path.resolve(__dirname, `../${config.paths.liquid_css_folder}`),
  snippets: path.resolve(__dirname, `../${config.paths.snippets_folder}`)
}

const Liquid = require('shopify-liquid');
const engine = Liquid({
  root: [folders.templates, folders.snippets, folders.css],  // dirs to lookup layouts/includes
  extname: '.liquid' // the default extname used for layouts/includes
});

// File specific options can be passed in as a second argument when calling this
function render(fileName, options = {}) {
  // Return a promise with a catch all error handler
  if (fileName === 'settings') {
    options.schema = require(`../${config.paths.config_folder}/settings_schema.json`);
  }
  return engine.renderFile(fileName, { settings: mergedSettings, options: options, template: fileName });
}

module.exports = render;