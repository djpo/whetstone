var express     = require('express'),
    db          = require('../models/index'),
    router      = express.Router();

router.get('/:targetUserId', function(req, res){
  var targetUserId = req.params.targetUserId;
  db.user.findOne({_id: targetUserId}, function (err, targetUser){
    if (err) return console.log(err);
    res.render('portfolio',
      {targetUser: targetUser}
    );
  });
});

module.exports = router;