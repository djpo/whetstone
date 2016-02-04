var nodemailer  = require('nodemailer'),
  Goal        = require('../models/goal'),
  CronJob     = require('cron').CronJob;

var job = new CronJob('* 01 * * * *', function() {
    /* Runs every minute or so */

    Goal.find({}, function(err, goals){
      goals.forEach(function(goal){

        /*Uncomment below to enable emails */
        //// create reusable transporter object using the default SMTP transport
        //var transporter = nodemailer.createTransport('smtps://name%40gmail.com:pw@smtp.gmail.com');
        //
        //// setup e-mail data with unicode symbols
        //var mailOptions = {
        //  from: 'Name <name@gmail.com>', // sender address
        //  to: user.email, // list of receivers
        //  subject: 'Subject', // Subject line
        //  text: 'Body', // plaintext body
        //  html: 'HTML body' // html body
        //};
        //
        //// send mail with defined transport object
        //transporter.sendMail(mailOptions, function(error, info){
        //  if(error){
        //    return console.log(error);
        //  }
        //  console.log('Message sent: ' + info.response);
        //});

        //  End forEach goal
      });
      //  End goal find
    });

  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  'America/Los_Angeles' /* Time zone of this job. */
);

module.exports = job;