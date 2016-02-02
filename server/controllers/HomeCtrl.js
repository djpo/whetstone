var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  console.log('testtesttest');
  res.render('index', {user: req.user});
});

router.get('/test', function(req, res){
  res.render('test');
})

module.exports = router;