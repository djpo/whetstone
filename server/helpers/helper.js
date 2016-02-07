var db = require('../models/index'),
    async = require('async'),
    Whet = Whet || {};

Whet = {
  payFriend: function(friend, amount, goalId, callback){
    //friends.forEach(function(friend){
    //async.each(friends, function(friend, callback){
      db.user.findOne({_id: friend}, function(err, user){
        if (err) console.log(err)
        console.log(user.username + ' INCREASED BY ' + amount)
        user.currentGoals[goalId].bankroll += amount;
        user.markModified('currentGoals');
        user.save(function(err){
          if(err) console.log(err)
          console.log('SAVED PAY FRIENDS ' + user.username)
          callback(null)
        });
      })
    //})
  },
  evenUp: function(goalId) {
    db.goal.findOne({_id: goalId}, function(err, goal){

    })
  }
}

module.exports = Whet;