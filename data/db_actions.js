const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));

const queryOpts = {
  force: process.env['NODE_ENV'] === 'production' ? false : true
}

// Database
const DB = require('./db');

// Models
const User = require(`../${config.paths.models_folder}/user`);
const Customer = require(`../${config.paths.models_folder}/customer`);

// Reset the tables
Customer.sync({force: true});
User.sync({force: true});

// User functions
function createUser(name, details) {
  let username;
  if (typeof details == 'object' && details.username) {
    username = details.username;
  } else {
    username = name.replace(/\b\s+\b/g, '').toLowerCase();
  }
  name = name.trim().split(' ');
  // TODO: Remove force for production
  User.sync().then(()=> {
    // Table created
    return User.create({
      username: username,
      firstName: name[0],
      lastName: name[1] || '',
      isAdmin: details.isAdmin || false,
      restrictions: details.restrictions || ''
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
    return User
      .findOne({ where: { username: username } })
      .then((err, user)=> {
        if (!user) {
          console.log(`No user with the username ${username} has been found.`);
        } else {
          console.log(`Hello ${user.username}!`);
          console.log(`All attributes of ${user.name}:`, user.get());
        }
      });
  }
}

// Customer Functions
function findCustomerById(id) {
  return Customer.findOne({ where: { id: id } });
}

function createCustomer(data) {
  return Customer.sync().then(()=> {
    // Table created
    return Customer.create({
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company
    });
  });
}

function getAllCustomers() {
  return Customer.findAll()
    .then((instances)=> {
      let customers = instances.map((instance)=> {
        return instance.get();
      });
      return customers;
    })
    .catch((error)=> {
      console.error(error);
    });
}

module.exports = {
  user: {
    create: createUser
  },
  customers: {
    findById: findCustomerById,
    create: createCustomer,
    findAll: getAllCustomers
  }
}