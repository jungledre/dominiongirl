var deckData = require("../deck.json");
var _ = require("lodash");

module.exports = {
    getDecks : function(deckArray){
        deckArray = (typeof deckArray == 'string') ? [deckArray] : deckArray
        var mergedDecks = [];
        for (var i = 0; i < deckArray.length; i++) {
            mergedDecks = mergedDecks.concat(deckData[deckArray[i]])
        }
        return mergedDecks;
    },

    shuffle : function(data){
        data = _.sample(data,10);
        return data;
    },

    sortAlpha : function(data){
        data = _.sortBy(data, 'card_name');
        return data;
    }
}

