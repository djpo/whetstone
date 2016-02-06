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
      // Render dashboard w/ data
      res.render('dashboard',
        { goal: goal,
          user: user,
          weeklySubs: goal.subs[user._id][goal.currentWeek]
        });
    });
  });
});

router.get('/archive', function(req, res){
  res.render('archive');
});

module.exports = router;