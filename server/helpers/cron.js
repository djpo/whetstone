var db            = require('../models/index'),
    mailer        = require('./mailer'),
    dateFormat    = require('dateformat'),
    CronJob       = require('cron').CronJob;

var job = new CronJob('1 * * * * *', function() {
  /* Runs every minute */
  console.log('~~~~~NEW DAY');
  var today = dateFormat(new Date(), "yyyymmdd");


    db.goal.find({is_active: true}).
  exec(function(err, goals){

    goals.forEach(function(goal){

      //Increment goal variable so base 1 instead of 0
      var currentWeekOneIndexed = goal.current_week + 1;
      var newWeek = false;
      var oneWeekAhead = dateFormat(new Date(goal.start_date.getTime() + (currentWeekOneIndexed * 7 * 86400000)), "yyyymmdd");

      //End goal if current date is passed end date
      if (goal.end_date <= new Date()){
        goal.is_active = false;
      }
      //If today's date is less than or equal to a week ahead of last week,
      //then increment the week
      else if(oneWeekAhead < today){
        newWeek = true;
        goal.current_week += 1;
        goal.save();
      }

      goal.members.forEach(function(member){
        db.user.findOne({_id: member}, function(err, user){

          if (newWeek) {
            console.log('~~~~~New week, reset missableDays');
            user.currentGoals[goal.id].missableDays = 7 - goal.frequency;
          }
          //If user didn't submit today
          if (!user.currentGoals[goal.id].submitted_today) {
            console.log('~~~~~User did not submit today');
            //If their credit == 0
            if(!user.currentGoals[goal.id].missableDays) {
              console.log('~~~~~User gets charged');
              //WARNING: only uncomment below when testing longer periods. will send you
              //emails every minute worst case. Can add up when running server.
              //mailer(user.email)
            } else {
              console.log('~~~~~User does not get charged but credits get decremented');
              user.currentGoals[goal.id].missableDays--;
            }
          } else {
          //  Else user did submit today, so reset flag
            console.log('~~~~~User submitted. Good job user!');
            user.currentGoals[goal.id].submitted_today = false;
          }

          user.markModified('currentGoals');
          user.save(function(err){
            if (err) console.log(err);
          })
        })
      });
    })
  });

  }, function () {
    /* This function is executed when the job stops */
  console.log('stopped')
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);

module.exports = job;