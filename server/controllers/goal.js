var express   = require('express'),
    multer    = require('multer'),
    upload    = multer({ dest: 'uploads/' }),
    db        = require('../models/index'),
    dateFormat = require('dateformat'),
    router    = express.Router();

router.get('/create', function(req, res){
  if (!req.user) return res.redirect('/');
  res.render('create_goal');
});

router.post('/savegoal', function(req, res){
  // Find the current user
  db.user.findOne({_id: req.user.id}, function(err, user){
    if (err) console.log(err);
    // Create new goal
    var newGoal = new db.goal(req.body);
    // Push current user to this goal's members array
    newGoal.members.push(user._id);
    // Save the goal to the db
    newGoal.save(function (err){
      if (err) return console.error(err);
      // Set user's activeGoal to this goal id, save user
      user.activeGoal = newGoal._id;
      user.save(function(err){
        if (err) console.log(err);
      });
    });
  });
  res.redirect('/goal/dashboard');
});

router.get('/dashboard', function(req, res){
  if (!req.user) return res.redirect('/');
  // Find current user
  db.user.findOne({_id: req.user.id}, function(err, user){
    if (err) console.log(err);
    // Find current user's current goal
    db.goal.findOne({_id: user.activeGoal}, function(err, goal){
      if (err) console.log(err);
      // Send activeGoal name to view
      res.render('dashboard', {goal: goal});
    });
  });
});

router.get('/archive', function(req, res){
  res.render('archive');
});

router.post('/upload', upload.single('submission'), function(req, res, next){
  //Find the current user so we can add submission to his/her file
  db.user.findOne({_id: req.user.id}, function(err, user){
    if (err) console.log(err);
    db.goal.findOne({_id: user.activeGoal}, function(err, goal){
      if (err) console.log(err);

      var submission = req.file;
      submission.user_id = user._id;
      submission.created_at = new Date();
      submission.note = req.body.note;

      goal.submissions.push(submission);
      goal.save(function(err){
        if (err) console.log(err);
        res.status(204).end()
      })

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
        return res.render('show_submission',
          {
            subDate: dateFormat(goal.submissions[i].created_at, "h:MM TT mmm dd"),
            subNote: goal.submissions[i].note,
            subFilename: goal.submissions[i].filename
          });
      }
    }

    console.log('submission not found');
    //res.status(200).end();
  })

});

module.exports = router;