const mongoose = require('mongoose');
const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema; 

const GoogleUserSchema = new Schema({

    Username: {
        type: String,
        required: true
    },

    ID: {
        type: String,
        required: true
    },



}, {timestamps: true});


GoogleUserSchema.plugin(findOrCreate);
const GoogleUser = mongoose.model('GoogleUsers', GoogleUserSchema)
module.exports = GoogleUser;


// e.preventDefault();
// $.get('/partials/main.ejs', function(data) {
//   $('#partial-container').html(data);
// }).done(function() {
//   $('#partial-container').siblings().remove();
