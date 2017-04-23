const path = require('path');
const config = require(path.join(__dirname, '../config/config.json'));
const { USER_DATA_PATH } = require(path.join(__dirname, `../${config.paths.components_folder}/paths`)); 

const Sequelize = require('sequelize');

// TODO: Allow for renaming, connecting to cloud db with url
const sequelizeDB = new Sequelize({
  host: config.database.host,
  dialect: config.database.dialect,
  // SQLite only
  storage: path.join(USER_DATA_PATH, `/${config.database.name}`)
});

module.exports = sequelizeDB;