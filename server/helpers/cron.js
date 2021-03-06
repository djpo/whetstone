var db            = require('../models/index'),
  warningmailer = require('./warningmailer'),
  chargemailer  = require('./chargemailer'),
  async         = require('async'),
  CronJob       = require('cron').CronJob;

var job = new CronJob('0 0 * * * *', function() {
    // Current timing: once every hour, on the hour

    // Timing argument, for reference
    // Seconds: 0-59
    // Minutes: 0-59
    // Hours: 0-23
    // Day of Month: 1-31
    // Months: 0-11
    // Day of Week: 0-6

    console.log('\n\n~~~~~NEW DAY');
    var now = new Date();
    console.log("~~~~~The current time is:", now, ".");
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    db.goal.find({isActive: true}).
    exec(function(err, goals) {

      goals.forEach(function(goal) {
        //console.log("Snapshot for " + goal.name + " before user logic: \n" + goal + "\n")

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
          console.log("~~~~~A new week starts now for goal '" + goal.name + "'.");
          newWeek = true;
          goal.currentWeek += 1;
          goal.save();
        } else {
          console.log("~~~~~Goal '" + goal.name + "' still active, same week.");
        }

        //DAILY CHANGES
        goal.members.forEach(function(member){
          db.user.findOne({_id: member}, function(err, user) {

            //console.log("Snapshot for " + user.username + " before user logic: \n" + user + "\n")

            if (newWeek) {
              console.log('~~~~~New week for ' + user.username + ', resetting missableDays.');
              user.currentGoals[goal.id].missableDays = 7 - goal.frequency;
            }
            //If user didn't submit today
            if (!user.currentGoals[goal.id].submitted_today) {
              console.log('~~~~~' + user.username + ' did not submit today.');
              //If they're out of missable days
              if(!user.currentGoals[goal.id].missableDays) {
                //User loses his/her incentive...
                user.currentGoals[goal.id].bankroll -= goal.incentive;
                console.log("~~~~~" + user.username + "'s bankroll DECREASED BY " + goal.incentive);
                user.markModified('currentGoals');
                user.save(function(err){
                  //...and pays the pot
                  chargemailer(user.username, user.currentGoals[goal.id].name)
                  goal.pot += goal.incentive;
                  goal.save()
                });
              } else {
                //User didn't submit but still has missable days
                user.currentGoals[goal.id].missableDays--;
                console.log('~~~~~' + user.username + ' does not get charged but missableDays get decremented.');

                if(user.currentGoals[goal.id].missableDays == 1){
                  warningmailer(user.username, user.currentGoals[goal.id].name)
                }
              }
            } else {
              //  Else ' + user + ' did submit today, so reset flag
              console.log('~~~~~' + user.username + ' submitted. Good job ' + user.username + '!');
            }

            //console.log("\nSnapshot for " + user.username + " after user logic: \n" + user + "\n\n")
            user.currentGoals[goal.id].submitted_today = false;
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
