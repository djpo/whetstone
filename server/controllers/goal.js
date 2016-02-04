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
    // Initialize goal
    newGoal.is_active = true;
    newGoal.start_date = new Date()
    newGoal.end_date = newGoal.start_date.getTime() + (newGoal.duration * 7 * 86400000);
    newGoal.current_week = 0;
    newGoal.subs = {};

    // Push current user to this goal's members array
      // Will have to update for multiple users starting a goal together
    newGoal.members.push(user._id);
    newGoal.members.forEach(function (member) {
      // Make an empty array for each member
      newGoal.subs[member] = [];
      // For each week (for each member) push an empty array
      for (var i = 0; i < newGoal.duration; i++) {
        newGoal.subs[member].push([]);
      }
    });

    // Alert db that subs has changed (bc subs is Schema.Types.Mixed)
    newGoal.markModified('subs');
    // Save the goal to the db
    newGoal.save(function (err){
      if (err) return console.error(err);
      // Set user's activeGoal to this goal id, save user
      user.activeGoal = newGoal._id;
      user.save(function(err){
        if (err) console.log(err);
        res.redirect('/goal/dashboard');
      });
    });
  });
});

router.get('/dashboard', function(req, res){
  if (!req.user) return res.redirect('/');
  if (!req.user.activeGoal) return res.redirect('../goal/create');
  // Find current user
  db.user.findOne({_id: req.user.id}, function(err, user){
    if (err) return console.log(err);
    // Find current user's current goal
    db.goal.findOne({_id: user.activeGoal}, function(err, goal){
      if (err) return console.log(err);
      res.render('dashboard', {goal: goal});
    });
  });
});

router.get('/archive', function(req, res){
  res.render('archive');
});

router.post('/upload', upload.single('submission'), function(req, res, next){
  console.log('//////////////////// POST /upload');

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
      if (goal.subs[user._id][goal.current_week] === undefined) {
        console.log("goal.subs[user._id][goal.current_week] === undefined");
        goal.subs[user._id][goal.current_week] = [];
      }

      // Add submission to goal
      goal.subs[user._id][goal.current_week].push(newSubmission);
      // Alert db that subs has changed (bc subs is Schema.Types.Mixed)
      goal.markModified('subs');
      // Save goal
      goal.save(function(err){
        if (err) return console.log(err);
        res.redirect('/goal/dashboard');
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
  });
});

module.exports = router;