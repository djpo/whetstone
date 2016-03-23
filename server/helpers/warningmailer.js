var nodemailer  = require('nodemailer');

var mailer = function(userEmail, goalName) {
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport('smtps://loki.bera%40gmail.com:mycat123@smtp.gmail.com');

// setup e-mail data with unicode symbols
  var mailOptions = {
    from: 'Whetstone <loki.bera@gmail.com>', // sender address
    to: userEmail, // list of receivers
    subject: goalName + ' - One Day Left', // Subject line
    text: 'Body', // plaintext body
    html: 'You have only one day left to miss on your goal ' + goalName + '. - The Whetstone Team' // html body
  };

// send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info) {
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
};

module.exports = mailer;
