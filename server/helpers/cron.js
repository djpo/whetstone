var db            = require('../models/index'),
    mailer        = require('./mailer'),
    dateFormat    = require('dateformat'),
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

  console.log('~~~~~NEW DAY');
  var now = new Date();
  console.log("The current time is:", now, ".");

  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  console.log("Today is:", today, ".");

    db.goal.find({isActive: true}).
  exec(function(err, goals) {

    goals.forEach(function(goal) {
      // Set newWeek default to false
      var newWeek = false;
      // End goal if end date is today
      if (goal.endDate <= today) {
        console.log("~~~~~Goal '" + goal.name + "' is over.");
        goal.isActive = false;
        goal.save();
      }
      // Start new week if it's the right day of the week
      else if (goal.weekStartsOn === today.getDay()) {
        console.log("It's that day of the week again! New week starts now for '" + goal.name + "'.");
        newWeek = true;
        goal.currentWeek += 1;
        goal.save();
      } else {
        console.log("Goal '" + goal.name + "' still active, same week.");
      }

      goal.members.forEach(function(member) {
        db.user.findOne({_id: member}, function(err, user) {

          if (newWeek) {
            console.log('~~~~~New week, resetting missableDays.');
            user.currentGoals[goal.id].missableDays = 7 - goal.frequency;
          }
          //If user didn't submit today
          if (!user.currentGoals[goal.id].submitted_today) {
            console.log('~~~~~' + user + ' did not submit today.');
            //If their credit == 0
            if(!user.currentGoals[goal.id].missableDays) {
              console.log('~~~~~' + user + ' gets charged.');
              //WARNING: only uncomment below when testing longer periods. will send you
              //emails every minute worst case. Can add up when running server.
              //mailer(user.email)
            } else {
              console.log('~~~~~' + user + ' does not get charged but credits get decremented.');
              ' + user + '.currentGoals[goal.id].missableDays--;
            }
          } else {
          //  Else ' + user + ' did submit today, so reset flag
            console.log('~~~~~' + user + ' submitted. Good job ' + user + '!');
            user.currentGoals[goal.id].submitted_today = false;
          }

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