var express     = require('express'),
    db          = require('../models/index'),
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
    newGoal.is_active = true;
    newGoal.start_date = new Date()
    newGoal.end_date = newGoal.start_date.getTime() + (newGoal.duration * 7 * 86400000);
    newGoal.current_week = 0;
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
      user.save(function(err){
        if (err) console.log(err);
        res.redirect('/');
      });
    });
  });
});

module.exports = router;