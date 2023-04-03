const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User')


const app = express();

app.set('view engine', 'ejs')


//connecting to mongo database and listening for port 3000
const dbURI = 'mongodb+srv://saadhzahid:saadh123@mymcluster.jtrlzq1.mongodb.net/MYMCluster?retryWrites=true&w=majority'

mongoose.connect(dbURI, {useNewUrlParseR: true, useUnifiedTopology: true})

.then((result) => console.log("connected to db"), app.listen(3000))
.catch((err) => console.log(err));




app.use(express.static('views'));



//main page
app.get('', (request, response)=> {

    

    response.render('index')

});



//404 page
app.use((request, response) => {
    response.status(404).send("<p>Error, page not found<p/>");
})