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
  }
};

module.exports = Whet;
