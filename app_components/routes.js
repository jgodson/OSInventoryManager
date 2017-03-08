const config = require('./app_config');
const DB = require(`../${config.paths.data_folder}/db_actions`)

const routes = {
  login: () => {
    DB.createUser("Jason Godson");
  }
}

module.exports = routes;