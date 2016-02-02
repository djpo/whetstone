var express     = require('express'),
    mongoose    = require('mongoose'),
    request     = require('request'),
    _           = require('lodash'),
    path        = require('path'),
    session     = require('express-session'),
    bodyParser  = require('body-parser'),
    passport    = require('passport'),
    //strategies  = require('./config/strategies'),
    LocalStrategy = require('passport-local').Strategy,
    db          = require('./server/models/index.js');

var app         = express();


//Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'client')));

app.use(passport.initialize());
app.use(passport.session());

//Passport configuration
passport.use(new LocalStrategy(db.user.authenticate()));
passport.serializeUser(db.user.serializeUser());
passport.deserializeUser(db.user.deserializeUser());


// Load the routes.
var routes = require('./server/routes');
//_.each(routes, function(controller, route) {
//  app.use(route, controller);
//});

app.use('/user', require('./server/controllers/user'));
app.use('/auth', require('./server/controllers/auth'));

mongoose.connect('mongodb://localhost:27017/whetstone' || process.env.MONGOLAB_URI);
mongoose.connection.once('open', function(){


  console.log("Running on the smooth sounds of port 3000");
  app.listen(process.env.PORT || 3000);
});