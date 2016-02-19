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

module.exports = router;