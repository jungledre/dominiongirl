"use strict";

module.exports = function(sequelize, DataTypes) {
  var card = sequelize.define("card", {
    cardName: DataTypes.STRING,
    deckId: DataTypes.INTEGER,
    cardType: DataTypes.STRING,
    trash: DataTypes.BOOLEAN,
    plusAction: DataTypes.INTEGER,
    plusCoin: DataTypes.INTEGER,
    plusBuy: DataTypes.INTEGER,
    costTreasure: DataTypes.INTEGER,
    costPotions: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return card;
};
