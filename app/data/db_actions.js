const path = require('path');
const config = require(path.join(__dirname, '../app_components/app_config'));

const QUERY_OPTS = {
  force: process.env.DB_CLEAN ? true : false
}

// Database
const DB = require(path.join(__dirname, 'db'));

// Models
const User = require(path.join(__dirname, `../${config.paths.models_folder}/user`));
const Customer = require(path.join(__dirname, `../${config.paths.models_folder}/customer`));

// Create tables if they don't exist
Customer.sync(QUERY_OPTS);
User.sync(QUERY_OPTS);

// TODO SPLIT INTO THEIR OWN FILES
// User functions
function createUser(name, details) {
  let username;
  if (typeof details == 'object' && details.username) {
    username = details.username;
  } else {
    username = name.replace(/\b\s+\b/g, '').toLowerCase();
  }
  name = name.trim().split(' ');
  User.sync()
    .then(()=> {
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
      .findOne({
        where: { username: username } 
      })
      .then((instance)=> {
        return instance.get();
      })
      .catch(errorHandler);
  }
}

// Customer Functions
function findCustomerById(id) {
  return Customer.findOne({ 
      where: { id: id } 
    })
    .then((instance)=> {
      return instance.get();
    })
    .catch(errorHandler);
}

function createCustomer(data) {
  return Customer.sync()
    .then(()=> {
      return Customer.create({
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        primaryContact: data.primaryContact,
        phone: data.phone,
        taxExemptions: data.taxExemptions,
        taxNumbers: data.taxNumbers
      });
    })
    .catch(errorHandler);
}

function editCustomer(data) {
  return Customer.update({
    firstName: data.firstName,
    lastName: data.lastName,
    company: data.company,
    primaryContact: data.primaryContact,
    phone: data.phone,
    taxExemptions: data.taxExemptions,
    taxNumbers: data.taxNumbers
  }, {
    where: { id: data.id }
  })
  .catch(errorHandler);
}

function deleteCustomer(id) {
  return Customer.destroy({
    where: { id: id }
  })
  .catch(errorHandler);
}

function getAllCustomers() {
  return Customer.findAll()
    .then((instances)=> {
      let customers = instances.map((instance)=> {
        return instance.get();
      });
      return customers;
    })
    .catch(errorHandler);
}

// Error handling function
function errorHandler(error) {
  return Promise.reject(`[Database Error] ${error}`);
}

module.exports = {
  users: {
    create: createUser
  },
  customers: {
    findById: findCustomerById,
    create: createCustomer,
    edit: editCustomer,
    delete: deleteCustomer,
    findAll: getAllCustomers
  }
}