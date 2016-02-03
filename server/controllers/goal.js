var express   = require('express'),
    multer    = require('multer'),
    upload    = multer({ dest: 'uploads/' }),
    db        = require('../models/index'),
    router    = express.Router();

router.get('/create', function(req, res){
  if(!req.user) return res.redirect('/');
  res.render('create_goal');
});

router.post('/savegoal', function(req, res){
  console.log('req.user:', req.user);
  console.log('req.body:', req.body);

  var newGoal = new db.goal(
    req.body

    // explicit properties from req.body
    // {
    //   name: req.body.name,
    //   content: req.body.content,
    //   frequency: req.body.frequency,
    //   period: req.body.period,
    //   length: req.body.length,
    //   publish: req.body.publish
    // }

    // harcoded properties to test without using form
    // {
    //   name: 'supergoal test1',
    //   content: 'image',
    //   frequency: 4,
    //   period: 'week',
    //   length: 12,
    //   publish: 'all'
    // }
  );
  console.log('newGoal:', newGoal);

  newGoal.save(function (err, newGoal){
    if (err) return console.error(err);
    console.log("goal saved!");
  });
  //TODO: set active goal on user to the new goal id
    //user.activeGoal = goal.id
  res.redirect('/goal/dashboard');
});


router.get('/dashboard', function(req, res){
  if(!req.user) return res.redirect('/');
  res.render('dashboard');
});

router.get('/archive', function(req, res){
  res.render('archive');
});

router.post('/upload', upload.single('submission'), function(req, res, next){
  var submission = new db.submission(req.file);
  submission.user_id = req.user.id;
  submission.save(function (err) {
    if (err) console.log(err);
    // saved!
  })
  res.status(204).end()
});

module.exports = router;