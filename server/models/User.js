var mongoose = require('mongoose'),
  bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: Date,
  updated_at: Date
});

userSchema.methods.sayHello = function() {
  return "Hi " + this.first_name;
};

userSchema.pre('save', function() {
  var user = this;
// only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

// generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  })
});

var User = mongoose.model('User', userSchema);

// make this available to our other files
module.exports = User;