var express       = require('express'),
  mongoose      = require('mongoose'),
  request       = require('request'),
  path          = require('path'),
  flash         = require('connect-flash'),
  session       = require('express-session'),
  bodyParser    = require('body-parser'),
  ejsLayouts    = require("express-ejs-layouts"),
  passport      = require('passport'),
  db            = require('./server/models/index.js'),
  _             = require('lodash'),
  LocalStrategy = require('passport-local').Strategy,
  runCron       = require('./server/helpers/cron.js');

var app           = express();

// Middleware
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/client')));
app.use(express.static(path.join(__dirname, '/uploads')));
app.use(session({
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Passport configuration
passport.use(new LocalStrategy(db.user.authenticate()));
passport.serializeUser(db.user.serializeUser());
passport.deserializeUser(db.user.deserializeUser());

//Give the user info to the front end
app.use(function(req,res,next){
  res.locals.currentUser  = req.user;
  res.locals.alerts       = req.flash('error');
  next();
});

// Load the routes
var routes = require('./server/routes');
_.each(routes, function(controller, route) {
  app.use(route, controller);
});

// Connect to mongo, run server
mongoose.connect('mongodb://localhost:27017/whetstone' || process.env.MONGOLAB_URI);
mongoose.connection.once('open', function(){

  // Start the cron job (comment to disable cron)
  runCron;

  console.log("Running on the smooth sounds of port 3000");
  app.listen(process.env.PORT || 3000);
});
