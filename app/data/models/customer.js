const Sequelize = require('sequelize');
const sequelize = require('../db');

const Customer = sequelize.define('customer', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    }, 
    company: {
      type: Sequelize.STRING
    }, 
    phone: {
      type: Sequelize.STRING
    }, 
    primaryContact: {
      type: Sequelize.STRING
    }, 
    taxExemptions: {
      type: Sequelize.STRING
    }, 
    taxNumbers: {
      type: Sequelize.STRING
    }
  }, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = Customer;