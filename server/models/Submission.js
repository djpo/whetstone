// Not being used. Submissions are stored in Goals.

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Submission = new Schema({
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

// make this available to our other files
module.exports = mongoose.model('Submission', Submission);