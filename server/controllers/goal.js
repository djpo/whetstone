var express = require('express');
var router = express.Router();

router.get('/create', function(req, res){
  //user.activeGoal = goal.id
  res.render('create_goal');
});

module.exports = router;