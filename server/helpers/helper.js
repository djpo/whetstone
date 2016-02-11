var db = require('../models/index'),
    Whet = Whet || {};

//Put any helper functions in here
Whet = {
  getDayName: function(dayNumber){
      switch(dayNumber) {
        case 0:
          return 'Sunday';
          break;
        case 1:
          return 'Monday';
          break;
        case 1:
          return 'Tuesday';
          break;
        case 1:
          return 'Wednesday';
          break;
        case 1:
          return 'Thursday';
          break;
        case 1:
          return 'Friday';
          break;
        case 6:
          return 'Saturday';
          break;
      }
    }
}


module.exports = Whet;