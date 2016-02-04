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


////////////////////
//////////
router.post('/savegoal', function(req, res){
  console.log('////////// POST /savegoal');

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

    // Push current user to this goal's members array
      // Will have to update for multiple users starting a goal together
    newGoal.members.push(user._id);

    // For each member, create an empty array
    newGoal.members.forEach(function (member) {
      newGoal.subs[member] = [];

      // For each week (for each member) push an empty array
      for (i = 0; i < newGoal.duration; i++) {
        newGoal.subs[member].push([]);
      }

      console.log('////////// newGoal.subs[member]');
      console.log(newGoal.subs[member]);
    });

    console.log('////////// newGoal.subs[56b3bcd0fdb668a01af8d717]');
    console.log(newGoal.subs[56b3bcd0fdb668a01af8d717]);

    // Save the goal to the db
    newGoal.save(function (err){
      if (err) return console.error(err);
      // Set user's activeGoal to this goal id, save user
      user.activeGoal = newGoal._id;
      user.save(function(err){
        if (err) console.log(err);

        console.log('////////// goal saved!');

        res.redirect('/goal/dashboard');
      });
    });
  });
});
//////////
////////////////////


router.get('/dashboard', function(req, res){
  console.log('////////// GET /dashboard');

  if (!req.user) return res.redirect('/');
  if (!req.user.activeGoal) return res.redirect('../goal/create');
  // Find current user
  db.user.findOne({_id: req.user.id}, function(err, user){
    if (err) return console.log(err);
    // Find current user's current goal
    db.goal.findOne({_id: user.activeGoal}, function(err, goal){
      if (err) return console.log(err);

      console.log('////////// goal');
      console.log(goal);
      console.log('////////// goal.subs[req.user.id]');
      console.log(goal.subs[req.user.id]);

      console.log('////////// sending goal to view');
      res.render('dashboard', {goal: goal});
    });
  });
});

router.get('/archive', function(req, res){
  res.render('archive');
});


////////////////////
//////////
router.post('/upload', upload.single('submission'), function(req, res, next){
  console.log('////////// POST /upload');

  // Find the current user
  db.user.findOne({_id: req.user.id}, function(err, user){
    if (err) return console.log(err);

    console.log('////////// user._id');
    console.log(user._id);
    console.log('////////// user.id');
    console.log(user.id);

    var thisUser = '56b3bcd0fdb668a01af8d717';
    console.log('////////// thisUser');
    console.log(thisUser);

    db.goal.findOne({_id: user.activeGoal}, function(err, goal){
      if (err) return console.log(err);

      console.log('////////// goal');
      console.log(goal);

      console.log('////////// goal.subs[thisUser][0] pre-add');
      console.log(goal.subs[thisUser][0]);

      var newSubmission = req.file;
      newSubmission.user_id = user._id;
      newSubmission.created_at = new Date();
      newSubmission.note = req.body.note;

      console.log('////////// newSubmission');
      console.log(newSubmission);

      console.log('////////// goal.subs[thisUser][0] post-add');
      console.log(goal.subs[thisUser][0]);

      res.send(goal);

      // // Add submission to goal
      // goal.subs[thisUser][goal.current_week].push(newSubmission);

      // console.log('//////////');
      // console.log(newGoal.subs[thisUser]);

      // // Save goal
      // // goal.save(function(err){
      // //   if (err) return console.log(err);
      // //   console.log('Submission created!');
      // //   res.status(204).end()
          // res.redirect('/goal/dashboard');
      // // });

    });
  });
});
//////////
////////////////////


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