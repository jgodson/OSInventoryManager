const path = require('path');
const settings = require(path.join(__dirname, '../config/settings_data.json'));
const config = require(path.join(__dirname, '../config/config.json'));
const dbPassword = settings.database.password;
const dbName = settings.database.name;
const dbUser = settings.database.user;

const Sequelize = require('sequelize');
const sequelizeDB = new Sequelize(dbName, dbUser, dbPassword, {
  host: config.database.host,
  dialect: config.database.dialect,
  pool: {
    max: 5,
    min: 1,
    idle: 10000
  },
  // SQLite only
  storage: `./${config.paths.app_data}/${dbName}.${config.database.file_ext}`
});

module.exports = sequelizeDB;