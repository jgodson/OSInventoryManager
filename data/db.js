const settings = require(`../config/settings_data.json`);
const config = require('../config/config.json');
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
    idle: 1000
  },
  // SQLite only
  storage: `../${config.paths.app_data}/${dbName}.${config.database.file_ext}`
});
console.log(`../${config.paths.app_data}/${dbName}.${config.database.file_ext}`);
module.exports = sequelizeDB;