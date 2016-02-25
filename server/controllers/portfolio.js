var express     = require('express'),
    db          = require('../models/index'),
    async       = require('async'),
    router      = express.Router();

router.get('/:targetUserId', function(req, res){
  var targetUserId = req.params.targetUserId;
  var targetGoals = [];
  db.user.findOne({_id: targetUserId}, function (err, targetUser){
    if (err) return console.log(err);
    function getTargetGoals(callback){
      var goalKeys = Object.keys(targetUser.currentGoals);
      var counter = 0;
      goalKeys.forEach(function(key, i, array){
        db.goal.findOne({_id: goalKeys[i]}, function(err, goal){
          if (err) return console.log(err);
          targetGoals.push(goal);
          counter++;
          // End the async function
          if (counter === array.length) callback();
        });
      });
    }
    // Send data to view and render
    async.series([
      getTargetGoals
    ], function(err){
      res.render('portfolio', {
        user        : targetUser,
        targetGoals : targetGoals
      });
    });
  });
});

router.post('/select', function(req, res){
  var selectedWeek = Number(req.body.selectedWeek);
  var selectedSub = Number(req.body.selectedSub);
  db.user.findOne({_id: req.user.id}, function(err, user){
    if (err) return console.log(err);
    user.currentGoals[user.activeGoal].portfolio[selectedWeek] = selectedSub;
    // Alert db that user.currentGoals has changed (bc currentGoals is Schema.Types.Mixed)
    user.markModified('currentGoals');
    // Save user
    user.save(function(err){
      if (err) return console.log(err);
      console.log("week [" + selectedWeek + "], sub [" + user.currentGoals[user.activeGoal].portfolio[selectedWeek] + "] added to " + user.name + "'s portfolio");
      res.sendStatus(200);
    });
  });
});

module.exports = router;