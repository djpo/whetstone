var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Submissions_Schema = new Schema({
  user_id     : String,
  created_at  : Date,
  content     : {
    fieldname   : String,
    originalname: String,
    encoding    : String,
    mimetype    : String,
    destination : String,
    filename    : {type: String, require: true, unique: true},
    path        : String,
    size        : Number
  }
});

var Week_Subs_Schema = new Schema(
  [Submissions_Schema]
);

var User_Subs_Schema = new Schema(
  {
    user_id     : [Week_Subs_Schema]
  }
);

var Goal_Schema = new Schema({
  name          : String,
  content_type  : String,
  frequency     : Number,
  duration      : Number,
  publish       : String,
  members       : Array,
  is_active     : Boolean,
  start_date    : Date,
  end_date      : Date,
  current_week  : Number,
  subs          : {User_Subs_Schema}
});

// make this available to our other files
module.exports = mongoose.model('Goal', Goal_Schema);

// var fakeGoal2 =
// {
//   name: 'Itsa goal',
//   subs:
//   {
//     'Jonny'     : [
//                     // week 0 submissions (as strings)
//                     ['J0a', 'J0b', 'J0c'],
//                     // week 1 submissions (as strings)
//                     ['J1a', 'J1b', 'J1c']
//                   ],
//     'Dumbledore': [
//                     // week 0 submissions (as strings)
//                     ['D0a', 'D0b','D0c'],
//                     // week 1 submissions (as strings)
//                     ['D1a', 'D1b','D1c']
//                   ]
//   }
// }