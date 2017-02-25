const config = require('../config/config.json');
const settings = require(`../config/app_settings.json`);
const path = require('path');

const f_views = `../${config.paths.base_views_folder}`;
const f_templates = `${f_views}/${config.paths.templates_folder}`;
const f_snippets = `${f_views}/${config.paths.snippets_folder}`

const Liquid = require('shopify-liquid');
const engine = Liquid({
    root: [path.resolve(__dirname, f_templates), path.resolve(__dirname, f_snippets)],  // dirs to lookup layouts/includes
    extname: '.liquid' // the default extname used for layouts/includes
});

function render(fileName, options) {
  return engine.renderFile(fileName, {settings: settings, options: options});
}

module.exports = render;