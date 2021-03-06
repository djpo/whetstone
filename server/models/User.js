var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  name            : String,
  activeGoal      : String,
  currentGoals    : Schema.Types.Mixed
});

User.plugin(passportLocalMongoose);

// make this available to our other files
module.exports = mongoose.model('User', User);