var db            = require('../models/index'),
    Whet          = require('./helper'),
    warningmailer = require('./warningmailer'),
    async         = require('async'),
    CronJob       = require('cron').CronJob;

var job = new CronJob('1 * * * * *', function() {
                      // Runs every minute (currently)

                  // Timing argument, for reference
                    // Seconds: 0-59
                    // Minutes: 0-59
                    // Hours: 0-23
                    // Day of Month: 1-31
                    // Months: 0-11
                    // Day of Week: 0-6

  console.log('\n\n\n~~~~~NEW DAY');
  var now = new Date();
  console.log("The current time is:", now, ".");

  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  console.log("Today is:", today, ".");

    db.goal.find({isActive: true}).
  exec(function(err, goals) {

    goals.forEach(function(goal) {
      console.log("Goal start date is: " + goal.startDate)
      // WEEKLY CHANGES
      // Set newWeek default to false
      var newWeek = false;
      // End goal if end date is today
      if (goal.endDate <= today) {
        console.log("~~~~~Goal '" + goal.name + "' is over.");
        goal.isActive = false;
        goal.save();
      }
      // Start new week if it's the right day of the week, but only if the start day wasn't today
      else if (goal.weekStartsOn === today.getDay() && goal.startDate.getTime() != today.getTime()) {
        console.log("It's that day of the week again! New week starts now for '" + goal.name + "'.");
        newWeek = true;
        goal.currentWeek += 1;
        goal.save();
      } else {
        console.log("Goal '" + goal.name + "' still active, same week.");
      }

      //DAILY CHANGES
      goal.members.forEach(function(member){
        db.user.findOne({_id: member}, function(err, user) {

          console.log("Snapshot for " + user.username + " before user logic: \n" + user + "\n")

          if (newWeek) {
            console.log('~~~~~New week, resetting missableDays.');
            user.currentGoals[goal.id].missableDays = 7 - goal.frequency;
          }
          //If user didn't submit today
          if (!user.currentGoals[goal.id].submitted_today) {
            console.log('~~~~~' + user.username + ' did not submit today.');
            //If they're out of missable days
            if(!user.currentGoals[goal.id].missableDays) {
              //Decrement user account
              user.currentGoals[goal.id].bankroll -= goal.incentive;
              console.log(user.username + 's bankroll DECREASED BY ' + goal.incentive)
              user.markModified('currentGoals');
              user.save(function(err){});


              //Pay other members
              //Get an array that has only the other members
              var friendsOnly = goal.members;
              friendsOnly.splice(friendsOnly.indexOf(user._id), 1);
              //For each friend, increase their bankroll by the incentive price divided amongst all friends
              friendsOnly.forEach(function(friendId){
                  db.user.findOne({_id: friendId}, function (err, thisUser) {
                    if (err) console.log(err);
                    thisUser.currentGoals[goal.id].bankroll += Math.floor(goal.incentive / friendsOnly.length);
                    thisUser.markModified('currentGoals');
                    thisUser.save(function (err) {
                      console.log(thisUser.username + " is saved here")
                    })
                  })
              });
              //Need to push current user back on so other users can see it
              friendsOnly.push(user.id);

              //ATTEMPT AT ASYNCH SOLUTION
              //var friendsOnly = goal.members;
              //friendsOnly.splice(friendsOnly.indexOf(user._id), 1);
              //var amount = Math.floor(goal.incentive / (friendsOnly.length));
              //var stack = [];
              //friendsOnly.forEach(function(friend){
              //  stack.push(Whet.payFriend(friend, amount, goal.id))
              //})
              //
              //async.waterfall([stack],
              //  function(err, result){
              //
              //  })
              //
              //friendsOnly.push(user.id)
              //
              //user.markModified('currentGoals');
              //user.save(function(err){
              //  if (err) console.log(err);
              //  console.log('SAVED USER DECREMENT')
              //});

            } else {
              //User didn't submit but still has missable days
              //WARNING: only uncomment below when testing longer periods. will send you
              //emails every minute worst case. Can add up when running server.
              //warningmailer(user.email)
              user.currentGoals[goal.id].missableDays--;
              console.log('~~~~~' + user.username + ' does not get charged but missableDays get decremented.');
            }
          } else {
          //  Else ' + user + ' did submit today, so reset flag
            user.currentGoals[goal.id].submitted_today = false;
            console.log('~~~~~' + user.username + ' submitted. Good job ' + user.username + '!');
          }

          console.log("\nSnapshot for " + user.username + " after user logic: \n" + user + "\n\n")
          user.markModified('currentGoals');
          user.save(function(err){
            if (err) console.log(err);
          });
        });
      });
    });
  });

  }, function () {
    /* This function is executed when the job stops */
  console.log('stopped');
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);

module.exports = job;