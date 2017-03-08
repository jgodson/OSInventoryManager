const config = require('../app_components/app_config.js');
const handlers = require(`../${config.paths.base_components_folder}/app_event_handlers`);

$(document).on('click', 'a[href]:not(a[href="#"])', handlers.handleNavigation);