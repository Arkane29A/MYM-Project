const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = 'your-google-client-id';
const GOOGLE_CLIENT_SECRET = 'your-google-client-secret';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, profile) {
        const newUser = new User({
            Username: profile,
            Password: googleId
          });
  
          newUser.save()
            .then(() => {
              res.redirect('/');
            })
            .catch((err) => {
              console.log(err);
              res.redirect('/');
            });
    });
  }
));

passport.serializeUser(function(user, done)
{
    return done(null, user);
});

passport.deserializeUser(function(user, done)
{
    return done(null, user);
});
