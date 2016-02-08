var express     = require('express'),
    db          = require('../models/index'),
    router      = express.Router();

router.get('/', function(req, res){
  if (!req.user) {
    // If user is not logged in, show welcome view
    res.render('welcome');
  } else {
    if (req.user.goals > 1) {
      // If user has more than one goal, show all goals
      res.redirect('/archive');
    } else if (req.user.activeGoal) {
      // If user has active goal, redirect to that goal
      res.redirect('/dashboard');
    } else {
      // If user has no goals, redirect to create a new goal
      res.redirect('/goal/new');
    }
  }
});

router.get('/dashboard', function(req, res){
  if (!req.user) return res.redirect('/');
  if (!req.user.activeGoal) return res.redirect('/goal/new');
  // Find current user
  db.user.findOne({_id: req.user.id}, function(err, user){
    if (err) return console.log(err);
    // Find current user's current goal
    db.goal.findOne({_id: user.activeGoal}, function(err, goal){
      if (err) return console.log(err);

      // Should this go in a separate script file? -DP
      var getDayName = function(dayNumber){
        switch(dayNumber) {
          case 0:
              return 'Sunday';
              break;
          case 1:
              return 'Monday';
              break;
          case 1:
              return 'Tuesday';
              break;
          case 1:
              return 'Wednesday';
              break;
          case 1:
              return 'Thursday';
              break;
          case 1:
              return 'Friday';
              break;
          case 6:
              return 'Saturday';
              break;
        }
      };

      // Prepare data to send to view
      var dayName = getDayName(goal.weekStartsOn);

      // Leaving console.log in to find source of error: 'weeklySubs is undefined' in dashboard.ejs
      console.log("goal.subs[user._id][goal.currentWeek]: " + goal.subs[user._id][goal.currentWeek]);
      var weeklySubs = goal.subs[user._id][goal.currentWeek] || [];

      res.render('dashboard',
        { goal: goal,
          user: user,
          weeklySubs: weeklySubs,
          dayName: dayName
        });
    });
  });
});

router.get('/archive', function(req, res){
  if (!req.user) return res.redirect('/');
  if (!req.user.activeGoal) return res.redirect('/goal/new');
  // Find current user
  db.user.findOne({_id: req.user.id}, function(err, user){
    if (err) return console.log(err);
    // Find current user's current goal
    db.goal.findOne({_id: user.activeGoal}, function(err, goal){
      if (err) return console.log(err);
      res.render('archive',
        { goal: goal,
          user: user
        });
    });
  });
});

module.exports = router;