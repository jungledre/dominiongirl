var db = require("./models");
var request = require('request');
var cheerio = require("cheerio");

var url = "http://dominiongame.info/2012/08/dominion-cards/"
var csspath = "#wp-table-reloaded-id-13-no-1 > tbody > tr"

var createCard  = function(thisCard) {
    var cardDescription = thisCard.children(".column-4").text();
    var actionMatch = cardDescription.match(/(\d+) Action/);

    var cardCost = thisCard.children(".column-2").text();
    var cardCostMatch = cardCost.match(/(\d) Coin/)

    db.deck.findOrCreate({where: {deck_name: thisCard.children(".column-5").text()}}).then(function(deck) {
        var card = {
        "card_name": thisCard.children(".column-1").text(),
        "expansion": thisCard.children(".column-5").text(),
        "card_type": thisCard.children(".column-3").text(),
        // "img_url": thisCard.find(".column-6 a").attr('href'),
        // "text": cardDescription,
        "deckId": deck[0].values.id,
        "trash": !!(cardDescription.match(/Trash/i)),
        "plus_action": parseInt((cardDescription.match(/(\d+) Action/) || [])[1]) || 0,
        "plus_coin": parseInt((cardDescription.match(/(\d+) Coin/) || [])[1]) || 0,
        "plus_buy": parseInt((cardDescription.match(/(\d+) Buy/) || [])[1]) || 0,
        "cost_treasure": parseInt((cardCost.match(/(\d+)\+? Coin/) || [])[1]) || 0,
        "cost_potions": parseInt((cardCost.match(/(\d+) Potion/) || [])[1]) || 0
        // "victory_points":
        // "treasure":
        }
        console.log(card)
        db.card.create(card)
    });
};

var updateCard = function() {
    db.card.find({where: {card_name:{in:["Platinum", "Potion", "Colony"]}}}).on('success', function(card){
        if (card) {
            card.updateAttributes({
                card_type: "Setup"
            }).success(function(){})
    }}
)}

// Project.find({ where: {title: 'aProject'} }).on('success', function(project) {
//   if (project) { // if the record exists in the db
//     project.updateAttributes({
//       title: 'a very different title now'
//     }).success(function() {});
//   }
// })

updateCard()

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    // console.log(body) // Print the google web page.
    $ = cheerio.load(body)
    var cards = $(csspath)

    for(var i =0; i < cards.length; i++) {
        var thisCard = $(cards[i])
        createCard(thisCard);



        // console.log("wget " + thisCard.find(".column-6 a").attr('href'))
        // ADD card_type
    }
    // db.dominiongirl.find({where: {id: req.params.id}})
    // .then(function(newCard){
    //     newCard.createCard({text: req.body.text})
    //     next();
    // });
  }
})

