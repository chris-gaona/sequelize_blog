'use strict';

// TODO: Add user authentication - http://www.hamiltonchapman.com/blog/2014/3/25/user-accounts-using-sequelize-and-passport-in-nodejs

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    admin: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};
