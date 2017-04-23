const path = require('path');
const routes = require(path.join(__dirname, './router'));

// Render initial view 
routes.index();