var express   = require('express'),
    router    = express.Router();

router.get('/create', function(req, res){
  //TODO: set active goal on user to the new goal id
  //user.activeGoal = goal.id
  res.render('create_goal');
});

// not creating new goal yet
router.post('/create', function(req, res){
  console.log(req.body);

  // var newGoal = new Goal({
  //   name: req.body.name,
  //   content: req.body.content,
  //   frequency: req.body.frequency,
  //   period: req.body.period,
  //   length: req.body.length,
  //   pulish: req.body.publish
  // });

  var testGoal = new Goal({
    name: 'one sick goal',
    content: 'image',
    frequency: '5',
    period: 'week',
    length: '8',
    publish: 'all'
  });
  console.log(textGoal);

  // testGoal.save(function (err, testGoal){
  //   if (err) return console.error(err);
  //   console.log("goal saved!");
  // });
  
  res.redirect('/goal/dashboard');
});



router.get('/dashboard', function(req, res){
  res.render('dashboard');
});

router.get('/archive', function(req, res){
  res.render('archive');
});

module.exports = router;