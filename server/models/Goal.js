var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// var Submissions_Schema = new Schema({
//   user_id     : String,
//   created_at  : Date,
//   content     : {
//     fieldname   : String,
//     originalname: String,
//     encoding    : String,
//     mimetype    : String,
//     destination : String,
//     filename    : {type: String, require: true, unique: true},
//     path        : String,
//     size        : Number
//   }
// });

// var Week_Subs_Schema = new Schema(
//   [Submissions_Schema]
// );

// var User_Subs_Schema = new Schema(
//   {
//     user_id     : [Week_Subs_Schema]
//   }
// );

var Goal_Schema = new Schema({
  name          : String,
  content_type  : String,
  frequency     : Number,
  duration      : Number,
  publish       : String,
  members       : Array,
  is_active     : Boolean,
  start_date    : Number,
  end_date      : Number,
  current_week  : Number,
  subs          : Schema.Types.Mixed
});

// make this available to our other files
module.exports = mongoose.model('Goal', Goal_Schema);