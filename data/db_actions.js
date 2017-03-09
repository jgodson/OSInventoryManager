const config = require('../app_components/app_config');

// Database
const DB = require('./db');

// Models
const User = require(`../${config.paths.models_folder}/user`);

// User functions
function createUser(name, details) {
  console.log(name, details);
  let username = details.username || name.join('').toLowerCase();
  name = name.trim().split(' ');
  User.sync({force: true}).then(()=> {
    // Table created
    return User.create({
      username: username,
      firstName: name[0],
      lastName: name[1] || ''
    });
  });
}

function findUser(params) {
  if (typeof params === 'string') {
    return findByUsername(params);
  } else if (typeof params === 'object') {
    switch (params) {
      case params.username !== undefined:
        return findByUsername(params.name);
        break;
      default:
        return undefined;
    }
  } else {
    return undefined;
  }

  function findByUsername(username) {
    User
      .findOne({ where: { username: username } })
      .then(function (err, user) {
        if (!user) {
          console.log(`No user with the username ${username} has been found.`);
        } else {
          console.log(`Hello ${user.username}!`);
          console.log('All attributes of john:', user.get());
        }
      });
  }
}

module.exports = {
  createUser: createUser
}