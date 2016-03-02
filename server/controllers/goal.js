var express       = require('express'),
    db            = require('../models/index'),
    invitemailer  = require('../helpers/invitemailer'),
    async         = require('async'),
    router        = express.Router();

router.use(function(req, res, next) {
  if (!req.user) return res.redirect('/');
  next();
});

router.get('/new', function(req, res) {
  res.render('goal/new_goal');
});

router.post('/save', function(req, res) {
  // Find the current user
  db.user.findOne({_id: req.user.id}, function(err, user) {
    if (err) console.log(err);

    // Create new goal
    var newGoal = new db.goal(req.body);
    // Initialize goal
    var now = new Date();
      // for development, to start the goal at a specified date:
      // var now = new Date("February 1, 2016 11:11:11");
    newGoal.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var endTime = new Date(newGoal.startDate.getTime() + (7 * newGoal.duration * 86400000));
    newGoal.endDate = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());
    newGoal.weekStartsOn = newGoal.startDate.getDay();
    newGoal.currentWeek = 0;
    newGoal.isActive = true;
    newGoal.pot = 0;
    newGoal.subs = {};

    function registerNewMembers(callback) {
      if (newGoal.friendsEmails.length == 0) return callback();
      var emailArray = newGoal.friendsEmails.split(",");
      var counter = 0; // Need an external counter because i is asynchronous, may go 0, 2, 1 3 instead of 0, 1, 2, 3
      emailArray.forEach(function(email, i, array) {

        db.user.register(new db.user(
          {
            name    : email.split('@')[0].trim(),
            username: email.trim()
          }
        ), 'temporary', function(err, newUser) {
          if (err) return console.log(err);
          //WARNING: only uncomment below when testing longer periods. Will send emails.
          //invitemailer(user.username)
          initializeUser(newUser)
          //Callback to the async function when all members have been registered/added
          counter++;
          if(counter === array.length){
            callback();
          }
        });
      });
    }

    function initializeUser(thisUser) {
      newGoal.members.push(thisUser.id);
      newGoal.subs[thisUser.id] = [];

      // Set user's activeGoal to this goal id, save user
      thisUser.activeGoal = newGoal.id;
      //Initialize mixed type currentGoals, then initialize values
      thisUser.currentGoals = thisUser.currentGoals || {};
      thisUser.currentGoals[newGoal.id] = {};
      thisUser.currentGoals[newGoal.id].name = newGoal.name;
      thisUser.currentGoals[newGoal.id].missableDays = 7 - newGoal.frequency;
      thisUser.currentGoals[newGoal.id].submitted_today = false;
      thisUser.currentGoals[newGoal.id].bankroll = 0;
      thisUser.currentGoals[newGoal.id].portfolio = [];

      for (var i = 0; i < newGoal.duration; i++) {
        // For each week, push an empty submissions array
        newGoal.subs[thisUser.id].push([]);
        // For each week, push an element to user's portfolio array (-1 means no selection)
        thisUser.currentGoals[newGoal.id].portfolio.push(-1);
      }

      thisUser.markModified('currentGoals');
      thisUser.save(function(err) {
          if (err) console.log(err);
        });
    }

    //Register the new members, then finish
    async.series([
      registerNewMembers
    ], function(err){
      if (err) console.log(err);
      initializeUser(user);
      
      // Alert db that subs has changed (because subs is Schema.Types.Mixed)
      newGoal.markModified('subs');
      // Save the goal to the db
      newGoal.save(function (err) {
        if (err) return console.error(err);
        res.redirect('/');
      });
    });

  });
});

module.exports = router;
