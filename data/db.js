const dbPassword = require(`../config/settings_data.json`).database_password;
const RxDB = require('rxdb');
const User = require('./models/user');

RxDB.plugin(require('pouchdb-adapter-node-websql'));

const DB = RxDB.create({
  name: './data/app_data/OSIMDB.sqlite',
  adapter: 'websql',
  password: dbPassword,
  multiInstance: 'true'
}).then(function(DB) {
  return Promise.resolve(DB);
});

module.exports = DB;