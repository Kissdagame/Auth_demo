const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new mongoose.Schema({
    username: String,
    password: String

});

//allows us to use the passport local mongoose page
UserSchema.plugin(passportLocalMongoose);

// exports the schema out to other pages
module.exports = mongoose.model('User', UserSchema);