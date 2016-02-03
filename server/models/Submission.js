var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Submission = new Schema({
  fieldname: String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number,
  user_id: String,
  created_at: Date
});

Submission.pre('save', function(next){
  var now = new Date();
  this.created_at = now;
  next();
});

// make this available to our other files
module.exports = mongoose.model('Submission', Submission);