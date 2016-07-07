'use strict';

var dateFormat = require('dateformat');

module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    comment: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "A comment is required"
        }
      }
    },
    author: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Comment.belongsTo(models.Article);
      }
    },
    instanceMethods: {
      commentedAt: function () {
        return dateFormat(this.createdAt, "dddd, mmmm dS, yyyy, h:MM TT");
      }
    }
  });
  return Comment;
};
