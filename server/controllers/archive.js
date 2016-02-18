var express     = require('express'),
    db          = require('../models/index'),
    router      = express.Router();

router.use(function(req, res, next){
  if (!req.user) return res.redirect('/');
  next();
});

router.get('/', function(req, res){
  if (!req.user.activeGoal) return res.redirect('/goal/new');
  var loggedInUser = req.user;
  db.goal.findOne({_id: loggedInUser.activeGoal}, function(err, goal){
    if (err) return console.log(err);

    // temporarily hard coding first four weeks' portfolio choices to each week's chosen portfolio sub index
    loggedInUser.currentGoals[goal.id].portfolio = [2, 1, 0, 4];

    res.render('archive',
      { goal: goal,
        user: loggedInUser
      }
    );
  });
});

router.get('/:targetUserId', function(req, res){
  var loggedInUser = req.user;
  var targetUserId = req.params.targetUserId;
  db.user.findOne({_id: targetUserId}, function (err, targetUser){
    if (err) return console.log(err);
    db.goal.findOne({_id: loggedInUser.activeGoal}, function(err, goal){
      if (err) return console.log(err);

      // temporarily hard coding first four weeks' portfolio choices to each week's chosen portfolio sub index
      targetUser.currentGoals[goal.id].portfolio = [2, 1, 0, 4];

      res.render('archive',
        { goal: goal,
          user: targetUser
        }
      );
    });
  });
});

module.exports = router;