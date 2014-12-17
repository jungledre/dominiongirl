"use strict";
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    email: {
      type:DataTypes.STRING,
      validate:{
        isEmail: {
          args:true,
          msg:'Please enter a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5,100],
          msg: "Please use a longer password"
        }
      }
    },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: {
      beforeCreate: function(data, garbage, sendback){
        var passwordToEncrypt = data.password;
        bcrypt.hash(passwordToEncrypt, 10, function(err, hash) {
          data.password = hash;
          sendback(null, data);
        })
      }
    }
  });

  return user;
};
