"use strict";

module.exports = function(sequelize, DataTypes) {
  var card = sequelize.define("card", {
    card_name: DataTypes.STRING,
    deck_id: DataTypes.INTEGER,
    card_type: DataTypes.STRING,
    trash: DataTypes.BOOLEAN,
    plus_action: DataTypes.INTEGER,
    plus_coin: DataTypes.INTEGER,
    plus_buy: DataTypes.INTEGER,
    cost_treasure: DataTypes.INTEGER,
    cost_potions: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.card.belongsTo(models.deck)
      }
    }
  });

  return card;
};
