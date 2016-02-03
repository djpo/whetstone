var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Goal = new Schema({
  name: String,
  content: String,
  frequency: Number,
  period: String,
  length: Number,
  publish: String,
  created_at: Date,
  updated_at: Date
});

// make this available to our other files
module.exports = mongoose.model('Goal', Goal);