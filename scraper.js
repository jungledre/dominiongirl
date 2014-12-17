var db = require("./models");
var request = require('request');
var cheerio = require("cheerio");

var url = "http://dominiongame.info/2012/08/dominion-cards/"
var csspath = "#wp-table-reloaded-id-13-no-1 > tbody > tr"

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    // console.log(body) // Print the google web page.
    $ = cheerio.load(body)
    var cards = $(csspath)

    for(var i =0; i < cards.length; i++) {
        var thisCard = $(cards[i])
        console.log("wget " + thisCard.find(".column-6 a").attr('href'))

        // ADD CARDNAMES
        // db.card.create({cardname: thisCard.children(".column-1").text()})
        // db.deck.findOrCreate({where: {deckname: thisCard.children(".column-5").text()}})

    }
    // db.dominiongirl.find({where: {id: req.params.id}})
    // .then(function(newCard){
    //     newCard.createCard({text: req.body.text})
    //     next();
    // });
  }
})

