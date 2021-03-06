var express     = require('express'),
    db          = require('../models/index'),
    async       = require('async'),
    router      = express.Router();

router.use(function(req, res, next) {
  if (!req.user) return res.redirect('/');
  next();
});

router.get('/', function(req, res) {
  if (!req.user.activeGoal) return res.redirect('/goal/new');
  var loggedInUser = req.user;
  db.goal.findOne({_id: loggedInUser.activeGoal}, function(err, goal) {
    if (err) return console.log(err);
    res.render('archive',
      { goal: goal,
        user: loggedInUser
      }
    );
  });
});

router.get('/:targetUserId', function(req, res) {
  var loggedInUser = req.user;
  var targetUserId = req.params.targetUserId;
  db.user.findOne({_id: targetUserId}, function(err, targetUser) {
    if (err) return console.log(err);
    db.goal.findOne({_id: loggedInUser.activeGoal}, function(err, goal) {
      if (err) return console.log(err);
      res.render('archive',
        { goal: goal,
          user: targetUser
        }
      );
    });
  });
});

router.post('/savePortSelection', function(req, res) {
  var goalSelect = req.body.goalSelect,
      weekSelect = parseInt(req.body.weekSelect),
      portSelect = parseInt(req.body.portSelect) - 1;
  db.user.findOne({_id: req.user.id}, function(err, user) {
    if (err) return console.log(err);
    user.currentGoals[goalSelect].portfolio[weekSelect] = parseInt(portSelect);
    user.markModified('currentGoals');
    user.save(function (err){
      if (err) return console.error(err);
      res.redirect('/archive');
    });
  });
});

router.put('/changeActiveGoal', function(req, res){
  var goalId = req.body.goalId;
  db.user.findOne({_id: req.user.id}, function(err, user){
    if (err) return console.log(err);
    user.activeGoal = goalId;
    user.save(function(err){
      if (err) return console.error(err);
      res.sendStatus(200);
    })
  })
})

module.exports = router;
