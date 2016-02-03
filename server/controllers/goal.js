var express   = require('express'),
    multer    = require('multer'),
    upload    = multer({ dest: 'uploads/' }),
    router    = express.Router();

router.get('/create', function(req, res){
  //TODO: set active goal on user to the new goal id
  //user.activeGoal = goal.id
  res.render('create_goal');
});

router.post('/create', function(req, res){
  console.log(req.body);
  // req.body currently looks like this:
  // {
  //   name: 'my sweet goal',
  //   content: 'image',
  //   frequency: '3',
  //   period: 'week',
  //   length: '8',
  //   publish: 'interval'
  // }
  
  res.redirect('/goal/dashboard');
});

router.get('/dashboard', function(req, res){
  res.render('dashboard');
});

router.get('/archive', function(req, res){
  res.render('archive');
});

router.post('/upload', upload.single('submission'), function(req, res, next){
  var submission = req.file;
  submission.user_id = req.user.id
  console.log(submission)
  res.status(204).end()
});

module.exports = router;