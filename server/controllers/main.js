var express     = require('express'),
    router      = express.Router();

router.get('/', function(req, res) {
  if (!req.user) {
    // If user is not logged in, show welcome view
    res.render('welcome');
  } else {
    if (req.user.goals > 1) {
      // If user has more than one goal, show all goals
      res.redirect('/archive');
    } else if (req.user.activeGoal) {
      // If user has active goal, redirect to that goal
      res.redirect('/dashboard');
    } else {
      // If user has no goals, redirect to create a new goal
      res.redirect('/goal/new');
    }
  }
});

module.exports = router;
