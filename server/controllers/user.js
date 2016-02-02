var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  console.log('here in user')
  res.send('HI', {});
});

module.exports = router;