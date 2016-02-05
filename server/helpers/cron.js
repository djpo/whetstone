var nodemailer  = require('nodemailer'),
  db            =  require('../models/index'),
  CronJob       = require('cron').CronJob;

var job = new CronJob('1 * * * * *', function() {
  /* Runs every minute or so */
  console.log('~~~~~NEW DAY~~~~~');

  db.goal.find({is_active: true}).
  exec(function(err, goals){

    goals.forEach(function(goal){

      //Increment the goal week variable
      //Increment goal variable so base 1 instead of 0. Conveniently becomes
      //variable we need to save
      var currentWeek = goal.current_week + 1;
      var newWeek = false;

      //End goal if current date is passed end date
      if (goal.end_date <= new Date()){
        goal.is_active = false;
      }
      //If today's date is less than or equal to a week ahead of last week,
      //then increment the week
      else if(new Date(goal.start_date.getTime() + (currentWeek * 7 * 86400000)) <= new Date()){
        newWeek = true;
        goal.current_week = currentWeek;
        goal.save();
      }


      goal.members.forEach(function(member){

        db.user.findOne({_id: member}, function(err, user){

          if (newWeek) {
            console.log('~~~~~New week, reset credits~~~~~');
            user.currentGoals[goal.id].credits = 7 - goal.frequency;
          }
          //If user didn't submit today
          if (!user.currentGoals[goal.id].submitted_today) {
            console.log('~~~~~User did not submit today~~~~~');
            //If their credit == 0
            if(!user.currentGoals[goal.id].credit) {
              console.log('~~~~~User gets charged~~~~~');
              //  TODO: Charge/email user
            } else {
              console.log('~~~~~User does not get charged but credits get decremented~~~~~');
              user.currentGoals[goal.id].credit--;
            }
          } else {
          //  Else user did submit today, so reset flag
            console.log('~~~~~User submitted. Good job user!~~~~~');
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