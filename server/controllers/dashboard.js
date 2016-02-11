var express     = require('express'),
    db          = require('../models/index'),
    async       = require('async'),
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
      // Prepare data to send to view
      var weeklySubs = goal.subs[currentUser.id][goal.currentWeek] || [];
      var dayName = require('../helpers/helper').getDayName(goal.weekStartsOn);
      var friendStatus = [];
      function getFriendStatus(callback){
        var holdTheCurrentUser = {};
        var counter = 0; // Need an external counter because i is asynchronous, may go 0, 2, 1, 3 instead of 0, 1, 2, 3
        // extract data from each goal member to pass to nav menu
        goal.members.forEach(function(goalMember, i, array){
          db.user.findOne({_id: goalMember}, function(err, memberUser){
            objToPushToFriendStatus = {
              name            : memberUser.name,
              submittedToday  : memberUser.currentGoals[goal.id].submitted_today,
              weeklyProgress  : goal.subs[memberUser.id][goal.currentWeek].length,
              friendId        : memberUser.id
            }
            // Hold the current user's info temporarily
            if (memberUser.id === currentUser.id) {
              holdTheCurrentUser = objToPushToFriendStatus;
            // Push the other member's info to friendStatus (unordered)
            } else {
              friendStatus.push(objToPushToFriendStatus);
            }
            counter++;
            if(counter === array.length){
              // Alphabetize friendStatus (minus the current user)
              friendStatus.sort(function(a, b){
                var nameA = a.name.toUpperCase();
                var nameB = b.name.toUpperCase();
                return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
              });
              // Place the current user's info at friendStatus[0]
              friendStatus.unshift(holdTheCurrentUser);
              // End the async function
              callback();
            }
          });
        });
      }
      // Send data to view and render
      async.series([
        getFriendStatus
      ], function(err){
        res.render('dashboard',
          { goal: goal,
            user: currentUser,
            weeklySubs: weeklySubs,
            dayName: dayName,
            friendStatus: friendStatus
          }
        );
      });
    });
  });
});

module.exports = router;