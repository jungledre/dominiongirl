"use strict";

module.exports = function(sequelize, DataTypes) {
  var feature = sequelize.define("feature", {
    text: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return feature;
};
