const Sequelize = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('user', {
    username: {
      type: Sequelize.STRING
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    }, 
    isAdmin: {
      type: Sequelize.BOOLEAN 
    },
    restrictions: {
      type: Sequelize.STRING
    }
  }, {
  freezeTableName: true // Model tableName will be the same as the model name
});

module.exports = User;