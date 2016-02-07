var express     = require('express'),
    db          = require('../models/index'),
    invitemailer= require('../helpers/invitemailer'),
    async       = require('async'),
    router      = express.Router();

router.use(function(req, res, next){
  if (!req.user) return res.redirect('/');
  next();
});

router.get('/new', function(req, res){
  res.render('goal/new_goal');
});

router.post('/save', function(req, res){
  // Find the current user
  db.user.findOne({_id: req.user.id}, function(err, user){
    if (err) console.log(err);

    // Create new goal
    var newGoal = new db.goal(req.body);
    // Initialize goal
      // Will have to change this if goal does not start immediately on goal creation
    var now = new Date();
    newGoal.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var endTime = new Date(newGoal.startDate.getTime() + (7 * newGoal.duration * 86400000));
    newGoal.endDate = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());
    newGoal.weekStartsOn = newGoal.startDate.getDay();
    newGoal.currentWeek = 0;
    newGoal.isActive = true;
    newGoal.pot = 0;
    newGoal.subs = {};
    // Push current user to this goal's members array
    // Will have to update for multiple users starting a goal together
    //newGoal.members.push(user._id);

    function registerNewMembers(callback){
      if (newGoal.friendsEmails.length == 0) return callback();
      var emailArray = newGoal.friendsEmails.split(",");
      var counter = 0; // Need an external counter because i is asynchronous
      emailArray.forEach(function(email, i, array){
        db.user.register(new db.user(
          {
            username : email,
            email: email
          }
        ), 'temporary', function(err, newUser) {
          //if (err) return res.render('error', { message: err });
          if (err) return console.log(err);

          //WARNING: only uncomment below when testing longer periods. will send you
          //emails every minute worst case. Can add up when running server.
          //invitemailer(user.email)

          initializeUser(newUser)
          counter++;
          if(counter === array.length){
            callback()
          }
        });
      })
      }

    function initializeUser(thisUser) {
      newGoal.members.push(thisUser._id);
      newGoal.subs[thisUser._id] = [];

      // For each week (for each member) push an empty array
      for (var j = 0; j < newGoal.duration; j++) {
        newGoal.subs[thisUser._id].push([]);
      }
      // Set user's activeGoal to this goal id, save user
      thisUser.activeGoal = newGoal._id;
      //Initialize mixed type currentGoals, then initialize values
      thisUser.currentGoals = {};
      thisUser.currentGoals[newGoal._id] = {};
      thisUser.currentGoals[newGoal._id].missableDays = 7 - newGoal.frequency;
      thisUser.currentGoals[newGoal._id].submitted_today = false;
      thisUser.currentGoals[newGoal._id].bankroll = 0;

      thisUser.markModified('currentGoals');
      thisUser.save(function(err){
          if (err) console.log(err);
        });
    }

    async.series([
      registerNewMembers
    ], function(err){
      if (err) console.log(err);
      initializeUser(user)
      // Alert db that subs has changed (bc subs is Schema.Types.Mixed)
      newGoal.markModified('subs');
      // Save the goal to the db
      newGoal.save(function (err){
        if (err) return console.error(err);
        res.redirect('/');
      });

    })

  });
});

module.exports = router;