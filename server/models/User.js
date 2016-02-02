var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  created_at: Date,
  updated_at: Date
});

User.plugin(passportLocalMongoose);

// make this available to our other files
module.exports = mongoose.model('User', User);