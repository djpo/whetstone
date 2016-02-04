var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Submissions_Schema = new Schema({
  user_id: String,
  content: {
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: {type: String, require: true, unique: true},
    path: String,
    size: Number
  }
});
var User_Subs_Schema = new Schema([Submissions_Schema]);
var Week_Schema = new Schema([User_Subs_Schema]);

var Goal_Schema = new Schema({
  name: String,
  content_type: String,
  frequency: Number,
  duration: Number,
  publish: String,
  members: Array,
  timing: {
    is_active: Boolean,
    start_date: Date,
    end_date: Date,
    current_week: Number
  },
  all_subs: [Week_Schema]
});


// make this available to our other files
module.exports = mongoose.model('Goal', Goal_Schema);