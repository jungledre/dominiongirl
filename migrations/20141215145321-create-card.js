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
      card_name: {
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
      card_type: {
        type: DataTypes.STRING
      },
      trash: {
        type: DataTypes.BOOLEAN
      },
      plus_action: {
        type: DataTypes.INTEGER
      },
      plus_coin: {
        type: DataTypes.INTEGER
      },
      plus_buy: {
        type: DataTypes.INTEGER
      },
      cost_treasure: {
        type: DataTypes.INTEGER
      },
      cost_potions: {
        type: DataTypes.INTEGER
      },
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("cards").done(done);
  }
};
