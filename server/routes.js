var path = require('path');
module.exports = {
  '/'				      : require('./controllers/main'),
    // for welome, dashboard, archive
  '/auth'		      : require('./controllers/auth'),
    // for registering user and logging in
  '/goal'         : require('./controllers/goal'),
    // for creating a new goal
  '/submissions'  : require('./controllers/submissions')
    // for uploading subs, viewing individual sub
};