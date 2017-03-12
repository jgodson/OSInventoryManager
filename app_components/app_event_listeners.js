const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const handlers = require(`../${config.paths.components_folder}/app_event_handlers`);
const appRoot = document.querySelector('#app-root');
const EventEmitter = require('events').EventEmitter;
const visualizer = new EventEmitter();

// Shows rendered html on the page
visualizer.on('rendercomplete', function(html) {
  appRoot.innerHTML = html;
});

$(document).on('click', 'a[href]:not(a[href="#"])', function(evt) {
  evt.preventDefault();
  handlers.navigation(evt);
});