const path = require('path');
const config = require(path.join(__dirname, 'app_config'));
const routes = require('./routes');

// Render initial view 
routes.index();