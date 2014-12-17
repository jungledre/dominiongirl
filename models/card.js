"use strict";

module.exports = function(sequelize, DataTypes) {
  var card = sequelize.define("card", {
    cardname: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return card;
};
