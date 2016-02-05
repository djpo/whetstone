var express     = require('express'),
    multer      = require('multer'),
    upload      = multer({ dest: 'uploads/' }),
    db          = require('../models/index'),
    dateFormat  = require('dateformat'),
    router      = express.Router();

router.use(function(req, res, next){
  if (!req.user) return res.redirect('/');
  next();
});

router.post('/upload', upload.single('submission'), function(req, res, next){
  // Find the current user
  db.user.findOne({_id: req.user.id}, function(err, user){
    if (err) return console.log(err);

    // Find the current user's activeGoal
    db.goal.findOne({_id: user.activeGoal}, function(err, goal){
      if (err) return console.log(err);

      // Create new submission, add metadata
      var newSubmission = req.file;
      newSubmission.user_id = user._id;
      newSubmission.created_at = new Date();
      newSubmission.note = req.body.note;

      // Test if user and week arrays exist already
      if (goal.subs[user._id] === undefined) {
        console.log("goal.subs[user._id] === undefined");
        goal.subs[user._id] = [];
      }
      if (goal.subs[user._id][goal.currentWeek] === undefined) {
        console.log("goal.subs[user._id][goal.currentWeek] === undefined");
        goal.subs[user._id][goal.currentWeek] = [];
      }

      // Add submission to goal
      goal.subs[user._id][goal.currentWeek].push(newSubmission);
      // Alert db that subs has changed (bc subs is Schema.Types.Mixed)
      goal.markModified('subs');
      // Save goal
      goal.save(function(err){
        if (err) return console.log(err);

        user.currentGoals[goal.id].submitted_today = true;
        user.markModified('currentGoals');
        user.save(function(err){
          if (err) return console.log(err);
          res.redirect('/dashboard');
        })
      });
    });
  });
});

router.get('/:goalid/:subid', function(req, res){
  var goalid = req.params.goalid;
  var subid = req.params.subid;

  db.goal.findOne({_id: goalid}, function (err, goal) {
    if (err) console.log(err);

    for (var i = 0; i < goal.submissions.length; i++){
      if(goal.submissions[i].filename == subid){
        return res.render('submissions/show',
          {
            subDate: dateFormat(goal.submissions[i].created_at, "h:MM TT mmm dd"),
            subNote: goal.submissions[i].note,
            subFilename: goal.submissions[i].filename
          });
      }
    }

    console.log('submission not found');
    //res.status(200).end();
  });
});

module.exports = router;