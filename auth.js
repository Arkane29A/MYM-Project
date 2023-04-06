const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/Googleuser')
const mongoose = require('mongoose');
const findOrCreate = require("mongoose-findorcreate");
const GoogleUser = require('./models/Googleuser');


const GOOGLE_CLIENT_ID = '635637600100-fppc3uj5egjbq2fdfk1n9p132gan6o5f.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';


passport.serializeUser(function(user, done)
{
    return done(null, user);
});

passport.deserializeUser(function(user, done)
{
    return done(null, user);
});


passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'production' ? "https://mymproject.herokuapp.com/google/callback" : "http://localhost:3000/google/callback"
},
function(accessToken, refreshToken, profile, cb) {

  
  return cb(null, profile);
}
));


