var express = require('express');
var router = express.Router();


var test_user = {name: 'Mr. Test'};

router.get('/', function(req, res){

	// Switch between below to test if user exists. I haven't tried with actual auth yet. -DP
  res.render('index');
  // res.render('index', {user: test_user});

});


module.exports = router;