var express = require('express');
var Instagram = require('instagram-node-lib');
var deckData = require("./deck.json");
var bodyParser = require('body-parser');
var _ = require("lodash");
var bcrypt = require('bcrypt');
var session = require('express-session');
var flash = require('connect-flash');
var request = require('request');
var db = require('./models');
var ch = require('./lib/cardHelper')

var myCards = []
var deckIds = []
var deckQuery = db.deck.findAll({where:{'deck_name':{in:['Dominion']}}}).then(function(deck){
    for (var i = deck.length - 1; i >= 0; i--) {
            deckIds.push(deck[i].dataValues.id)
        };
    // console.log(deckIds)

    db.card.findAll({limit:10,order:'random()',where:{'deckId':{in:deckIds}}}).then(function(cards){
        for (var i = cards.length - 1; i >= 0; i--) {
            myCards.push(cards[i].dataValues.card_name)
        };
        // console.log(myCards)
    })
    return myCards
});


var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));


app.use(session({
    secret: 'sparkles',
    resave: false,
    saveUninitialized: true
}))

app.use(function(req, res, next){
    req.getUser = function(){
        return req.session.user || false;
    }

    if(!req.session.settings) {
        req.session.settings={};
    }

    if(!req.session.settings.deckChoice){
        req.session.settings.deckChoice = deckQuery._settledValue;
    }

    next();
})

app.use(flash());

app.get('*',function(req,res,next){
    var alerts = req.flash();
    res.locals.alerts = alerts;
    res.locals.currentUser = req.getUser();
    next();
})

Instagram.set('client_id', process.env.client_id);
Instagram.set('client_secret', process.env.client_secret);

// HOME
app.get('/', function(req, res, next){
    console.log("hello")

    // console.log("Card Name:" , deckQuery._settledValue[0])
    // console.log(deckData.Dominion[0])
    console.log(deckQuery._settledValue)
    console.log("https://s3-us-west-2.amazonaws.com/dominiongirl/card_images/" + deckQuery._settledValue[0].replace(/[\s-']/g,'').toLowerCase() + ".jpg")
    res.render('home', {deckChoice : deckQuery._settledValue});
});

// CUSTOMIZE
app.get('/settings', function(req, res, next){
    res.render('settings');
})

app.post('/', function(req, res, next){
    console.log(deckQuery)
    req.session.settings.deckChoice = deckQuery ;
    res.redirect('/');
});

// ABOUT
app.get('/about', function(req, res){
    res.render('about')
});


// WISHLIST
app.route('/wishlist')
.get(function(req, res){
    db.feature.findAll({order: 'id DESC'}).done(function(err, feature) {
        res.render('wishlist', {feature: feature});
    });
})
.post(function(req, res){
    db.feature.create({text: req.body.text})
    .then(function(theText){
        res.redirect('/wishlist')
    });
});

// INSTAGRAM
app.get('/photos', function(req,res) {
    Instagram.tags.recent({ name: 'beedog',
        complete: function(data){
            // console.log(data[1].images.standard_resolution.url )
            res.render('photos', {data: data})
        }
    });
});

// LOGIN FORM
app.route('/login')
.get(function(req,res){
    res.render('login');
})
.post(function(req,res){
    db.user.find({where: {email:req.body.email}}).then(function(userObj){
        if(userObj){
            bcrypt.compare(req.body.password, userObj.password, function(err, match){
                if(match === true){
                    req.session.user = {
                        id: userObj.id,
                        email: userObj.email,
                        name: userObj.name
                    };
                    res.redirect('/');
                } else{
                    req.flash('warning','Invalid password');
                    res.redirect('/login')
                }
            })
        } else{
            req.flash('warning','Unknown user');
            res.redirect('/login')
        }
    });
});

// SIGNUP FORM
app.route('/signup')
.get(function(req,res){
    res.render('signup');
})
.post(function(req,res){
    var user = {
        where: {email:req.body.email},
        defaults:{email:req.body.email, password:req.body.password, name:req.body.name }
    }
    db.user.findOrCreate(user).spread(function(data, created){
        res.redirect('/login');
    }).
    catch(function(error){
        if(error && error.errors && Array(error.errors)){
            error.errors.forEach(function(errorItem){
                req.flash('danger',errorItem.message);
            })
        } else {
            req.flash('danger', 'Something weird happened.')
        }
        res.redirect('/signup')
    });
});

//LOGOUT
app.get('/logout',function(req,res){
    delete req.session.user;
    req.flash('info', 'You have been logged out.')
    res.redirect('/')
});

// // HANDLE 404
// app.use(function(req, res, next){
//   res.status(404);
//   if (req.accepts('html')) {
//     res.render('404', { url: req.url });
//     return;
//   }
//   if (req.accepts('json')) {
//     res.send({ error: 'Not found' });
//     return;
//   }
//   res.type('txt').send('Not found');
// });

// // HANDLE 500
// app.use(function(err, req, res, next){
//   // we may use properties of the error object
//   // here and next(err) appropriately, or if
//   // we possibly recovered from the error, simply next().
//   res.status(err.status || 500);
//   res.render('500', { error: err });
// });

app.listen(process.env.PORT || 3000, function(){
    console.log('DEATH RACE 3000!');
});
