var path = require('path');
module.exports = {

  '/' : function(req, res){
    res.sendFile(path.join(__dirname, '../client/views/index.html'));
  },
  '/example' : require('./controllers/delete-this')


};