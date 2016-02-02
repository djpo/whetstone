var express = require('express');
var router = express.Router();

router.get('/create', function(req, res){
  res.render('create_goal');
});

module.exports = router;