"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("cards", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      cardName: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deckId: {
        type: DataTypes.INTEGER
      },
      cardType: {
        type: DataTypes.STRING
      },
      trash: {
        type: DataTypes.BOOLEAN
      },
      plusAction: {
        type: DataTypes.INTEGER
      },
      plusCoin: {
        type: DataTypes.INTEGER
      },
      plusBuy: {
        type: DataTypes.INTEGER
      },
      costTreasure: {
        type: DataTypes.INTEGER
      },
      costPotions: {
        type: DataTypes.INTEGER
      },
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("cards").done(done);
  }
};
