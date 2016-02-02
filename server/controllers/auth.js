var express   = require('express'),
    passport  = require('passport'),
    db        = require('../models/index'),
    User      = db.user,
    router    = express.Router();

router.post('/register', function(req, res) {
  console.log(req.body);
  User.register(new User(
    {
      username : req.body.username,
      email: req.body.email
    }
  ), req.body.password, function(err, user) {
    if (err) return res.render('error', { message: err });

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.render('index');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;