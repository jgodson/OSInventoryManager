const path = require('path');
const config = require(path.join(__dirname, 'app_config'));
const utils = require(path.join(__dirname, 'utils'));
const jQuery = require('jquery');

// Set up where to get settings data from
const { USER_DATA_PATH } = require(path.join(__dirname, 'paths'));
const SETTINGS_FILE_NAME = 'settings_data.json';

// Global app settings will be available in any template rendered
// If settings aren't present, defaults are used
const SETTINGS = require(`${USER_DATA_PATH}/${SETTINGS_FILE_NAME}`);
const DEFAULT_SETTINGS = utils.getDefaultSettings();
const MEREGED_SETTINGS = {};
jQuery.extend(true, MEREGED_SETTINGS, DEFAULT_SETTINGS, SETTINGS);

// Name of layout file to render
const LAYOUT_NAME = 'layout';

// Set up folders for liquid files
const FOLDERS = {
  templates: path.resolve(__dirname, `../${config.paths.templates_folder}`),
  css: path.resolve(__dirname, `../${config.paths.liquid_css_folder}`),
  snippets: path.resolve(__dirname, `../${config.paths.snippets_folder}`)
}

// Get the settings_schema.json file
const SETTINGS_SCHEMA = require(path.join(__dirname, `../${config.paths.config_folder}/settings_schema.json`));

const Liquid = require('shopify-liquid');
const engine = Liquid({
  root: [FOLDERS.templates, FOLDERS.snippets, FOLDERS.css],  // dirs to lookup layouts/includes
  extname: '.liquid' // the default extname used for layouts/includes
});

// File specific options can be passed in as a second argument when calling this
function render(fileName, options = {}) {
  // Return a promise with a catch all error handler
  if (fileName === 'settings') {
    options.schema = SETTINGS_SCHEMA;
  }
  
  return engine.renderFile(options.layout === false ? fileName : LAYOUT_NAME, { 
    settings: MEREGED_SETTINGS,
    options: options,
    template: fileName 
  });
}

module.exports = render;