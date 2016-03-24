var nodemailer  = require('nodemailer');

var mailer = function(userEmail, goalName) {
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport('smtps://loki.bera%40gmail.com:mycat123@smtp.gmail.com');

// setup e-mail data with unicode symbols
  var mailOptions = {
    from: 'Whetstone <loki.bera@gmail.com>', // sender address
    to: userEmail, // list of receivers
    subject: goalName + ' - You have missed a day', // Subject line
    text: 'Body', // plaintext body
    html: 'You have no days left for your goal "' + goalName + '" and have lost your incentive for the day. Get your' +
    ' shit together. - The Whetstone Team' // html body
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
