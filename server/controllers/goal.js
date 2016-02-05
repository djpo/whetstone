var express     = require('express'),
    db          = require('../models/index'),
    dateFormat  = require('dateformat'),
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
    var today = new Date();
    newGoal.startDate = Number(dateFormat(today, "yyyymmdd"));
    var endDay = today + (86400000 * newGoal.duration * 7);
    newGoal.endDate = Number(dateFormat(endDay, "yyyymmdd"));
    newGoal.isActive = true;
    newGoal.currentWeek = 0;
    newGoal.subs = {};
    // Push current user to this goal's members array
    // Will have to update for multiple users starting a goal together
    newGoal.members.push(user._id);
    newGoal.members.forEach(function (member) {
      // Make an empty array for each member
      newGoal.subs[member] = [];
      // For each week (for each member) push an empty array
      for (var i = 0; i < newGoal.duration; i++) {
        newGoal.subs[member].push([]);
      }
    });

    // Alert db that subs has changed (bc subs is Schema.Types.Mixed)
    newGoal.markModified('subs');
    // Save the goal to the db
    newGoal.save(function (err){
      if (err) return console.error(err);
      // Set user's activeGoal to this goal id, save user
      user.activeGoal = newGoal._id;

      //Initialize mixed type currentGoals, then initialize values
      user.currentGoals = {};
      user.currentGoals[newGoal._id] = {};
      user.currentGoals[newGoal._id].missableDays = 7 - newGoal.frequency;
      user.currentGoals[newGoal._id].submitted_today = false;

      user.markModified('currentGoals');
      user.save(function(err){
        if (err) console.log(err);
        res.redirect('/');
      });
    });
  });
});

module.exports = router;