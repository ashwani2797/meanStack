var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

var User             = require('../models/user'); 
var session          = require('express-session');
var jwt  			       = require('jsonwebtoken');
var secret 			     = 'harrypotter';


module.exports = function(app,passport){


	app.use(passport.initialize());
  	app.use(passport.session());
	app.use(session({
  		secret: 'keyboard cat',
  		resave: false,
  		saveUninitialized: true,
  		cookie: { secure: false }
	}));

	passport.serializeUser(function(user, done) {
    if(user.active){
      token = jwt.sign({ username : user.username , email : user.email },secret,{expiresIn:'24h'});

    } else {
      token = 'inactive/error';
    }

  		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
  		User.findById(id, function(err, user) {
    		done(err, user);
  		});
	});


passport.use(new FacebookStrategy({
    clientID: '215142292290833',
    clientSecret:'72022c01c7d32852978fd4558f81fe5f',
    callbackURL: "http://localhost:8085/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log(profile._json.email);
 	User.findOne({ email: profile._json.email}).select('username password email active').exec(function(err,user){
 		if(err) done(err);

 		if( user && user != null){
 			done(null,user);
 		} else {
 			done(err);
 		}
 	})
  }
));

passport.use(new TwitterStrategy({
    consumerKey: 'pCKo96mj9yJsQQHwDupvy8XYr',
    consumerSecret:'ZlR4YoPmGC4bcF0FINwv7Eu358ca1vFP89V5PfEslZA8C44yL7',
    callbackURL: "http://localhost:8085/auth/twitter/callback",
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile.emails[0].value);
User.findOne({ email: profile.emails[0].value}).select('username password email active').exec(function(err,user){
    if(err) done(err);

    if( user && user != null){
      done(null,user);
    } else {
      done(err);
    }
  })
  }
));


passport.use(new GoogleStrategy({
    clientID:'739902929384-rmah825gq61jj6q9dq10qbfve24ll6cp.apps.googleusercontent.com',
    clientSecret: 'AePM97gFMt60p38aTts7qUV0',
    callbackURL: "http://localhost:8085/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
   User.findOne({ email: profile.emails[0].value}).select('username password email active').exec(function(err,user){
    if(err) done(err);

    if( user && user != null){
      done(null,user);
    } else {
      done(err);
    }
  })
  }
));

app.get('/auth/google',passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','profile','email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }),function(req, res) {
    res.redirect('/google/'+token);
  });

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',passport.authenticate('twitter', { failureRedirect: '/twittererror' }) , function(req,res){
  res.redirect('/twitter/' + token);
});

app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/facebookerror' }),function(req,res){
		res.redirect('/facebook/' + token);
	});
  		app.get('/auth/facebook',passport.authenticate('facebook', { authType: 'rerequest', scope: 'email' }));
return passport;
}