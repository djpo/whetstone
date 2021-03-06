var express     = require('express'),
    multer      = require('multer'),
    upload      = multer({ dest: 'uploads/', limits: {fileSize: 5000000} }).single('submission'),
    db          = require('../models/index'),
    dateFormat  = require('dateformat'),
    router      = express.Router();

router.use(function(req, res, next) {
  if (!req.user) return res.redirect('/');
  next();
});

router.post('/upload', function(req, res, next) {
  upload(req, res, function(err){
    if (err){
      req.flash('error', 'error: file size too big, 5mb max.')
      res.redirect('/dashboard')
    } else {
      // Find the current user
      db.user.findOne({_id: req.user.id}, function(err, user) {
        if (err) return console.log(err);
        // Find the current user's activeGoal
        db.goal.findOne({_id: user.activeGoal}, function(err, goal) {
          if (err) return console.log(err);
          // Create new submission, add metadata
          var newSubmission = req.file;
          newSubmission.user_id = user.id;
          newSubmission.created_at = new Date();
          newSubmission.note = req.body.note;
          // Add submission to goal
          goal.subs[user.id][goal.currentWeek].push(newSubmission);
          // Alert db that subs has changed (bc subs is Schema.Types.Mixed)
          goal.markModified('subs');
          // Save goal
          goal.save(function(err) {
            if (err) return console.log(err);
            user.currentGoals[goal.id].submitted_today = true;
            user.markModified('currentGoals');
            user.save(function(err) {
              if (err) return console.log(err);
              res.redirect('/dashboard');
            })
          });
        });
      });
    }
  })

});

router.post('/uploadtext', function(req, res) {
  // Find the current user
  db.user.findOne({_id: req.user.id}, function(err, user) {
    if (err) return console.log(err);
    // Find the current user's activeGoal
    db.goal.findOne({_id: user.activeGoal}, function(err, goal) {
      if (err) return console.log(err);
      // Create new submission, add metadata
      var newSubmission = {
        user_id     : user.id,
        created_at  : new Date(),
        note        : req.body.note,
        text        : req.body.newSubmission,
        wordCount   : req.body.wordCount,
        title       : req.body.title
      }
      // Test if user and week arrays exist already; create blank if not
      if (goal.subs[user._id] === undefined) {
        goal.subs[user._id] = [];
      }
      if (goal.subs[user._id][goal.currentWeek] === undefined) {
        goal.subs[user._id][goal.currentWeek] = [];
      }
      // Add submission to goal
      goal.subs[user._id][goal.currentWeek].push(newSubmission);
      // Alert db that subs has changed (bc subs is Schema.Types.Mixed)
      goal.markModified('subs');
      // Save goal
      goal.save(function(err) {
        if (err) return console.log(err);
        user.currentGoals[goal.id].submitted_today = true;
        user.markModified('currentGoals');
        user.save(function(err) {
          if (err) return console.log(err);
          res.sendStatus(200);
        })
      });
    });
  });
})

router.post('/comment', function(req, res){
  var content = req.body.content,
    goalId = req.body.goalId,
    userId = req.body.userId,
    weekNum = req.body.weekNum,
    subNum = req.body.subNum,
    date = req.body.date;
  db.goal.findOne({_id: goalId}, function(err, goal){
    if (err) return console.log(err)

      var author = req.user.name;
      var subToComment = goal.subs[userId][weekNum][subNum];

      subToComment.comments = subToComment.comments || [];
      subToComment.comments.push({content: content, author: author, date: date})

      goal.markModified('subs');
      goal.save(function(err){
        if (err) return console.log(err);
        res.send({author: author})
      })
    })
})

router.get('/:goalId/:userId/:weekNum/:subNum', function(req, res) {
  var goalId  = req.params.goalId,
      userId  = req.params.userId,
      weekNum = parseInt(req.params.weekNum),
      subNum  = parseInt(req.params.subNum);
  db.goal.findOne({_id: goalId}, function (err, goal) {
    if (err) return console.log(err);

    if (goal.members.indexOf(req.user.id) == -1){
      res.sendStatus(403)
    }

    db.user.findOne({_id: userId}, function (err, user) {
      if (err) return console.log(err);
      var subUserName = user.name;
      var subToShow = goal.subs[userId][weekNum][subNum];
      return res.render('submissions/show',
        {
          subDate     : dateFormat(subToShow.created_at, "mmm dd h:MMtt"),
          subNote     : subToShow.note,
          subFilename : subToShow.filename,
          subWeekNum  : weekNum,
          subNum      : subNum,
          subUserName : subUserName,
          subText     : subToShow.text,
          subTitle    : subToShow.title,
          subWordCount: subToShow.wordCount,
          subComments : subToShow.comments
        }
      );
    });
  });
});

module.exports = router;
