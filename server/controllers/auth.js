var express   = require('express'),
    passport  = require('passport'),
    db        = require('../models/index'),
    User      = db.user,
    router    = express.Router();

router.post('/register', function(req, res) {
  User.register(new User(
    {
      username : req.body.username,
      submitted_today : false
    }
  ), req.body.password, function(err, user) {
    if (err) return res.render('error', { message: err });
    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;