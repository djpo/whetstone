var express     = require('express'),
    mongoose    = require('mongoose'),
    request     = require('request'),
    _           = require('lodash'),
    path        = require('path'),
    session     = require('express-session'),
    bodyParser  = require('body-parser'),
    db          = require('./server/models/index.js');

var app         = express();


//Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'client')));
app.use(session({
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: true
}));
app.use(function(req, res, next){
  res.locals.currentUser = req.session.user;
  next();
});

// Load the routes.
var routes = require('./server/routes');
_.each(routes, function(controller, route) {
  app.use(route, controller);
});


mongoose.connect('mongodb://localhost:27017/whetstone' || process.env.MONGOLAB_URI);
mongoose.connection.once('open', function(){


  var testUser = new db.user({
    username: 'reed',
    email: 'reed.kinning@gmail.com',
    password: '1234'
  });

  testUser.save().then(function(){
    db.user.findOne({username: 'reed'}, function(err, user){
      if(err) console.log(err);
      console.log(user)

      user.comparePassword('124', function(err, isMatch){
        console.log("Is a match? " + isMatch)
      })

    })
  });


  console.log("Running on the smooth sounds of port 3000");
  app.listen(process.env.PORT || 3000);
});