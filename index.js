var express = require('express');
var app = express();
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

    if(!req.session.settings.deckchoice){
        req.session.settings.deckchoice = deckData.Dominion;
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
    res.render('home', {deckchoice : ch.sortAlpha(ch.shuffle(req.session.settings.deckchoice,10))});
});

// CUSTOMIZE
app.get('/settings', function(req, res, next){
    res.render('settings');
})

app.post('/', function(req, res, next){
    req.session.settings.deckchoice = ch.sortAlpha(ch.getDecks(req.body.deckchoice));
    res.redirect('/');
    // res.send({deckchoice : ch.sortAlpha(ch.shuffle(ch.getDecks(req.body.deckchoice)))})
})


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
app.get('/login',function(req,res){
    res.render('login');
});

app.post('/login',function(req,res){
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
app.get('/signup',function(req,res){
    res.render('signup');
});

app.post('/signup',function(req,res){
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


app.listen(process.env.PORT || 3000, function(){
    console.log('DEATH RACE 3000!');
});
