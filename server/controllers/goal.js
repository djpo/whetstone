var express       = require('express'),
    db            = require('../models/index'),
    invitemailer  = require('../helpers/invitemailer'),
    async         = require('async'),
    whet          = require('../helpers/whet'),
    router        = express.Router();

router.use(function(req, res, next) {
  if (!req.user) return res.redirect('/');
  next();
});

router.get('/new', function(req, res) {
  res.render('goal/new_goal');
});

router.post('/save', function(req, res) {
  // Find the current user
  db.user.findOne({_id: req.user.id}, function(err, user) {
    if (err) console.log(err);

    // Create new goal
    var newGoal = new db.goal(req.body);
    // Initialize goal
    var now = new Date();
      // for development, to start the goal at a specified date:
      // var now = new Date("February 1, 2016 11:11:11");
    newGoal.startDate     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var endTime           = new Date(newGoal.startDate.getTime() + (7 * newGoal.duration * 86400000));
    newGoal.endDate       = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());
    newGoal.weekStartsOn  = newGoal.startDate.getDay();
    newGoal.currentWeek   = 0;
    newGoal.isActive      = true;
    newGoal.pot           = 0;
    newGoal.subs          = {};


    //Register the new members, then finish
    async.series([
      whet.registerNewUsers(newGoal)
    ], function(err){
      if (err) console.log(err);
      whet.initializeUser(user, newGoal);
      
      // Alert db that subs has changed (because subs is Schema.Types.Mixed)
      newGoal.markModified('subs');
      // Save the goal to the db
      newGoal.save(function (err) {
        if (err) return console.error(err);
        res.redirect('/');
      });
    });

  });
});

module.exports = router;
