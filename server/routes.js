var path = require('path');
module.exports = {
  '/'				: require('./controllers/main'),
  '/user'		: require('./controllers/user'),
  '/auth'		: require('./controllers/auth'),
  '/goal'   : require('./controllers/goal')
};