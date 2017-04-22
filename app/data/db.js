const path = require('path');
const config = require(path.join(__dirname, '../config/config.json'));

const Sequelize = require('sequelize');
const sequelizeDB = new Sequelize(null, null, null, {
  host: config.database.host,
  dialect: config.database.dialect,
  pool: {
    max: 5,
    min: 1,
    idle: 10000
  },
  // SQLite only
  storage: `./${config.paths.app_data}/${config.database.name}`
});

module.exports = sequelizeDB;