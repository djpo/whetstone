var express   = require('express'),
    multer    = require('multer'),
    upload    = multer({ dest: 'uploads/' }),
    db        = require('../models/index'),
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
      res.render('dashboard', {goal: goal, submissions: user.submissions});
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
    //Create new submission and put the current user's id on it
    var submission = new db.submission(req.file);
    submission.user_id = user._id;
    //Save the submission to the db
    submission.save(function (err) {
      if (err) console.log(err);
      //Push submission into user table
      user.submissions.push(submission);
      user.save(function(err){
        if (err) console.log(err);
        res.status(204).end()
      });
    });
  });
});

module.exports = router;