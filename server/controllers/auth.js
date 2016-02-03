var express   = require('express'),
    passport  = require('passport'),
    db        = require('../models/index'),
    User      = db.user,
    router    = express.Router();

router.post('/register', function(req, res) {
  console.log(req.body);
  User.register(new User(
    {
      username : req.body.username,
      email: req.body.email
    }
  ), req.body.password, function(err, user) {
    if (err) return res.render('error', { message: err });

    passport.authenticate('local')(req, res, function () {
      //Redirect immediately to new goal creation
      res.redirect('../goal/create');
    });
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  //Toggle below to test goal dashboard view
  req.user.activeGoal = "sl98sj30s92k";

  if (req.user.goals > 1) {
    //If user has more than one goal, show all goals
    res.redirect('../goal/archive')
  } else if (req.user.activeGoal) {
    //If user has active goal, redirect to that goal
    res.redirect('../goal/dashboard')
  } else {
    //If user has no goals, redirect to create a new goal
    res.redirect('../goal/create');
  }
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;