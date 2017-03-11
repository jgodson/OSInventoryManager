const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));
const handlers = require(`../${config.paths.components_folder}/app_event_handlers`);

$(document).on('click', 'a[href]:not(a[href="#"])', handlers.handleNavigation);