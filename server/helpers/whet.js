var Whet = Whet || {};

//Put any helper functions in here
Whet = {
  getDayName: function(dayNumber) {
    switch(dayNumber) {
      case 0:
        return 'Sunday';
        break;
      case 1:
        return 'Monday';
        break;
      case 2:
        return 'Tuesday';
        break;
      case 3:
        return 'Wednesday';
        break;
      case 4:
        return 'Thursday';
        break;
      case 5:
        return 'Friday';
        break;
      case 6:
        return 'Saturday';
        break;
      default:
        return 'what day is it?';
    }
  },
  registerNewUsers: function(callback, newGoal){
      if (newGoal.friendsEmails.length == 0)
        return callback();
      var emailArray = newGoal.friendsEmails.split(",");
      var counter = 0; // Need an external counter because i is asynchronous, may go 0, 2, 1 3 instead of 0, 1, 2, 3
      emailArray.forEach(function(email, i, array){
        db.user.register(new db.user(
          {
            name    : email.split('@')[0].trim(),
            username: email.trim()
          }
        ), 'temporary', function(err, newUser) {
          if (err) return console.log(err);

          //WARNING: only uncomment below when testing longer periods. Will send emails.
          //invitemailer(user.username)

          initializeUser(newUser)

          //Callback to the async function when all members have been registered/added
          counter++;
          if(counter === array.length){
            callback();
          }
        });
      });
    },
  initializeUser: function(thisUser, newGoal){
      newGoal.members.push(thisUser.id);
      newGoal.subs[thisUser.id] = [];

      // Set user's activeGoal to this goal id, save user
      thisUser.activeGoal = newGoal.id;
      //Initialize mixed type currentGoals, then initialize values
      thisUser.currentGoals = thisUser.currentGoals || {};
      thisUser.currentGoals[newGoal.id] = {};
      thisUser.currentGoals[newGoal.id].name = newGoal.name;
      thisUser.currentGoals[newGoal.id].missableDays = 7 - newGoal.frequency;
      thisUser.currentGoals[newGoal.id].submitted_today = false;
      thisUser.currentGoals[newGoal.id].bankroll = 0;
      thisUser.currentGoals[newGoal.id].portfolio = [];

      for (var i = 0; i < newGoal.duration; i++) {
        // For each week, push an empty submissions array
        newGoal.subs[thisUser.id].push([]);
        // For each week, push an element to user's portfolio array (-1 means no selection)
        thisUser.currentGoals[newGoal.id].portfolio.push(-1);
      }

      thisUser.markModified('currentGoals');
      thisUser.save(function(err) {
        if (err) console.log(err);
      });
    }
};

module.exports = Whet;
