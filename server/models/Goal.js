var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Goal_Schema = new Schema({
  name          : String,
  contentType   : String,
  frequency     : Number,
  duration      : Number,
  publish       : String,
  members       : Array,
  isActive      : Boolean,
  startDate     : Date,
  endDate       : Date,
  weekStartsOn  : Number,
  currentWeek   : Number,
  subs          : Schema.Types.Mixed
});

// make this available to our other files
module.exports = mongoose.model('Goal', Goal_Schema);