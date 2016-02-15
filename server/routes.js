var path = require('path');
module.exports = {
  '/'				      : require('./controllers/main'),
    // for welome page, and redirecting to appropriate home page
  '/auth'		      : require('./controllers/auth'),
    // for registering user and logging in
  '/goal'         : require('./controllers/goal'),
    // for creating a new goal
  '/dashboard'    : require('./controllers/dashboard'),
    // for viewing the current week dashboard
  '/archive'      : require('./controllers/archive'),
    // for viewing all goals
  '/submissions'  : require('./controllers/submissions'),
    // for uploading subs, viewing individual sub
  '/portfolio'    : require('./controllers/portfolio')
    // for viewing user's portfolio page, and making portfolio selections
};