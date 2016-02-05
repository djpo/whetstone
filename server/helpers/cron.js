var nodemailer  = require('nodemailer'),
  db            =  require('../models/index'),
  CronJob       = require('cron').CronJob;

var job = new CronJob('* 10 * * * *', function() {
  /* Runs every minute or so */

  db.goal.find({is_active: true}).
  exec(function(err, goals){

    goals.forEach(function(goal){

      goal.members.forEach(function(member){

        db.user.find({_id: member}).exec(function(user){
          //If user didn't submit today
          if (!user.currentGoals[goal.id].submittedToday) {
            //If their credit == 0
            if(!user.currentGoals[goal.id].credit) {
            //  TODO: Charge/email user
            } else {
              user.currentGoals[goal.id].credit--;
            }
          }

          user.markModified('currentGoals');
          user.save(function(err){
            if (err) console.log(err);
          })
        })
      });



      //Increment the goal week variable
      //Increment goal variable so base 1 instead of 0. Conveniently becomes
      //variable we need to save
      var currentWeek = goal.current_week + 1;

      //End goal if current date is passed end date
      if (goal.end_date <= new Date()){
        goal.is_active = false;
      }
      //Above we incremented the week # because it needs to be on a base 1 scale
      //so * by 1, not 0. If today's date is less than or equal to a week ahead of last week,
      //then increment the week
      else if(new Date(goal.start_date.getTime() + (currentWeek * 7 * 86400000)) <= new Date()){
        //TODO: reset user credits
        goal.current_week = currentWeek;
        goal.save();
      }
    })

  });

    //Goal.find({}, function(err, goals){
    //  goals.forEach(function(goal){
    //
    //    /*Uncomment below to enable emails */
    //    //// create reusable transporter object using the default SMTP transport
    //    //var transporter = nodemailer.createTransport('smtps://name%40gmail.com:pw@smtp.gmail.com');
    //    //
    //    //// setup e-mail data with unicode symbols
    //    //var mailOptions = {
    //    //  from: 'Name <name@gmail.com>', // sender address
    //    //  to: user.email, // list of receivers
    //    //  subject: 'Subject', // Subject line
    //    //  text: 'Body', // plaintext body
    //    //  html: 'HTML body' // html body
    //    //};
    //    //
    //    //// send mail with defined transport object
    //    //transporter.sendMail(mailOptions, function(error, info){
    //    //  if(error){
    //    //    return console.log(error);
    //    //  }
    //    //  console.log('Message sent: ' + info.response);
    //    //});
    //
    //    //  End forEach goal
    //  });
    //  //  End goal find
    //});

  }, function () {
    /* This function is executed when the job stops */
  console.log('stopped')
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);

module.exports = job;