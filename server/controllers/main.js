var express = require('express');
var router = express.Router();

router.get('/', function(req, res){

  if (!req.user) {
    res.render('index');
  } else {
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
  }


  res.render('index');
});

module.exports = router;