const mongoose = require('mongoose');
const findOrCreate = require("mongoose-findorcreate");

const Schema = mongoose.Schema; 

const UserSchema = new Schema({

    Username: {
        type: String,
        required: true
    },

    Password: {
        type: String,
        required: true
    },



}, {timestamps: true});


UserSchema.plugin(findOrCreate);
const User = mongoose.model('Users', UserSchema)
module.exports = User;


// e.preventDefault();
// $.get('/partials/main.ejs', function(data) {
//   $('#partial-container').html(data);
// }).done(function() {
//   $('#partial-container').siblings().remove();
