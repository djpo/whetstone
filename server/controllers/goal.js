var express = require('express');
var router = express.Router();

router.get('/create', function(req, res){
  //TODO: set active goal on user to the new goal id
  //user.activeGoal = goal.id
  res.render('create_goal');
});

router.get('/dashboard', function(req, res){
  res.render('dashboard')
})

module.exports = router;