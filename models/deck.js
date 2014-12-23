"use strict";

module.exports = function(sequelize, DataTypes) {
  var deck = sequelize.define("deck", {
    deck_name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.deck.hasMany(models.card)
      }
    }
  });

  return deck;
};
