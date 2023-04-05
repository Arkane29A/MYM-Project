const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User')

const app = express();
const axios = require('axios');


app.set('view engine', 'ejs');

//connecting to mongo database and listening for port 3000
const dbURI = 'mongodb+srv://saadhzahid:saadh123@mymcluster.jtrlzq1.mongodb.net/MYMCluster?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

app.use(express.static('views'));
app.use(express.urlencoded({ extended: true }));



//google authentication

// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const GOOGLE_CLIENT_ID = 'our-google-client-id';
// const GOOGLE_CLIENT_SECRET = 'our-google-client-secret';
// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//       userProfile=profile;
//       return done(null, userProfile);
//   }
// ));

// app.get('/auth/google', 
//   passport.authenticate('google', { scope : ['profile', 'email'] }));
 
// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/error' }),
//   function(req, res) {
//     // Successful authentication, redirect success.
//     res.redirect('/success');
//   });


//retrives the image from nasa
app.get('/main', async (req, res) => {
    try {
      // fetch the data for the Astronomy Picture of the Day
      const response = await axios.get('https://api.nasa.gov/planetary/apod?api_key=0nfWdzCXRidY0ch0EaTCryJz9DRg9Y9PH7d1pKcD');
  
      // check if the response was successful
      if (response.status === 200) {
        // extract the image URL from the response data

        console.log("API successful");
        console.log(response.data.url);
        const imageUrl = response.data.url;
        const imageinfo = response.data.title;
  
        // render the index.ejs template and pass the image URL as a variable
        res.render('partials/main', { imageUrl, imageinfo });
    } else {
        console.error(response.statusText);
        res.send('An error occurred');
      }
    } catch (error) {
      console.error(error);
      res.send('An error occurred');
    }
  });

  
//main page
app.get('/', (req, res) => {
  res.render('index');
});

//registering an account
app.post("/register", (req, res) => {
  const username = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;

  console.log(username, password, confirmPassword);

  const usernameRegex = new RegExp('^[\\w-]+([\\.-]?[\\w]+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$');
  const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

  //checks if the email is valid.
  if (usernameRegex.test(username)) {
    //checks if the passwords are the same
    if (password === confirmPassword) {
      //All requirements met
      if (passwordRegex.test(password)) {
        console.log("All requirements met");
        const newUser = new User({
          Username: username,
          Password: password
        });

        newUser.save()
          .then(() => {
            res.redirect('/');
          })
          .catch((err) => {
            console.log(err);
            res.redirect('/');
          });
      } else {
        //password doesn't fit requirements
        console.log("Must contain at least one lowercase letter ");
        console.log("Must contain at least one uppercase letter ");
        console.log("Must contain at least one digit ");
        console.log("Must contain at least one of the special characters ");
        console.log("Must be at least 8 characters long");
        res.redirect('/');
      }
    } else {
      console.log("Password is not the same. DENIED");
      res.redirect('/');
    }
  } else {
    console.log("Invalid email format. DENIED");
    res.redirect('/');
  }
});

// app.get('/partials/main', (req, res) => {
//   res.render('main');
// });

app.get("/login", (req, res) => {
  const username = req.query.loginemail;
  const password = req.query.loginpassword;

  User.findOne({ Username: username })
    .then((user) => {
      if (user && user.Password === password) {
        console.log("authenticated");
        // res.render('partials/main');
        res.redirect('/main');

      } else {
        console.log("Incorrect username or password");
        res.redirect('/');
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/');
    });
});

//404 page
app.use((req, res) => {
  res.status(404).send("<p>Error, page not found<p/>");
});
