const config = require('../app_components/app_config');
const DB = require('./db');

function createUser(name, details) {
  myDatabase.collection({
  name: 'humans',
  schema: mySchema
})
  .then(collection => console.dir(collection));
}

module.exports = {
  createUser: createUser
}