"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.renameColumn('cards', 'deck_id', 'deckId').done(done);
  },
};
