const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User')
const passport = require('passport');
const app = express();
const axios = require('axios');
const cookieSession = require('cookie-session');
const googleauth = require('./auth');
const session = require('express-session');

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

// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
  name: 'tuto-session',
  keys: ['key1', 'key2']
}))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}


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
  
        // render the start.ejs template and pass the image URL as a variable
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
  const errorMessage = req.query.error;
  const successMessage = "";
  res.render('start', { errorMessage, successMessage });
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
            const successMessage = "New User created";
            const errorMessage = "";
            res.render('start', { successMessage, errorMessage });          })
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
        const errorMessage = "Must contain at least one lowercase letter \n"+
        "Must contain at least one uppercase letter \n"+ 
        "Must contain at least one digit \n"+
        "Must contain at least one of the special characters \n" +
        "Must be at least 8 characters long";
        const successMessage = "";


                res.render('start', { errorMessage, successMessage });        
      }
    } else {
      console.log("Password is not the same. DENIED");
      const errorMessage = "Ensure the Password is the same";
      const successMessage = "";

      res.render('start', { errorMessage, successMessage });
    }
  } else {
      const errorMessage = "Invalid email address";
      const successMessage = "";

      res.render('start', { errorMessage, successMessage });;
  }
});



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
        const errorMessage = "Incorrect username or password";
        const successMessage = "";
  
        res.render('start', { errorMessage, successMessage });      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/');
    });
});

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))

// Auth Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/main');
  }
);




app.get('/logout', (request, response) =>{

    request.session = null;
    request.logout();
    response.redirect('/')

});

//404 page
app.use((req, res) => {
  res.status(404).send("<p>Error, page not found<p/>");
});

