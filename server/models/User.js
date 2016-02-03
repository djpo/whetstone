var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  submissions : [{ type: Schema.Types.ObjectId, ref: 'Submission' }],
  activeGoal: String,
  created_at: Date,
  updated_at: Date
});

User.plugin(passportLocalMongoose);

// make this available to our other files
module.exports = mongoose.model('User', User);