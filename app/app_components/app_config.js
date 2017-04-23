// This file is simply to make it easy to change the location of the config.json file
const path = require('path');
const config = require(path.join(__dirname, '../config/config.json'));
module.exports = config;