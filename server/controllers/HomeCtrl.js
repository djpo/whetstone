var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  console.log('testtesttest');
  res.sendFile('./client/views/test.html');
});

module.exports = router;