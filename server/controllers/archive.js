var express     = require('express'),
    db          = require('../models/index'),
    router      = express.Router();

router.use(function(req, res, next){
  if (!req.user) return res.redirect('/');
  next();
});

router.get('/', function(req, res){
  if (!req.user.activeGoal) return res.redirect('/goal/new');
  // Find current user
  db.user.findOne({_id: req.user.id}, function(err, currentUser){
    if (err) return console.log(err);
    // Find current user's current goal
    db.goal.findOne({_id: currentUser.activeGoal}, function(err, goal){
      if (err) return console.log(err);
      var counter = 0;
      res.render('archive',
        { goal: goal,
          user: currentUser
        });
    });
  });
});

module.exports = router;