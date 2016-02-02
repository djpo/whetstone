var express = require('express');
var router = express.Router();

var test_user = {name: 'Mr. Test'};

router.get('/', function(req, res){
  res.render('home', {user: test_user});
});

module.exports = router;