var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Goal = new Schema({
  name: String,
  content: String,
  frequency: Number,
  period: String,
  length: Number,
  publish: String,
  members: Array,
  created_at: {type: Date, default: Date.now}
});

// make this available to our other files
module.exports = mongoose.model('Goal', Goal);