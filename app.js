var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session=require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore =require('connect-mongo')(session);


var routes = require('./routes/index');
var userRoutes = require('./routes/user');
// var userRoutes = require('./routes/user');
var app = express();
//"mongodb+srv://admin:aluthra1403@cluster0-mrukq.gcp.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect("mongodb://localhost/shopping",{useNewUrlParser: true });
require('./config/passport');
// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname ,'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(validator());
app.use(cookieParser());
app.use(session({secret: 'mysupersecret',
  resave:false,
  saveUninitialized:false,
store: new MongoStore({ mongooseConnection: mongoose.connection }),
cookie:{maxAge: 180*60*1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});
app.use('/user', userRoutes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
//app.use('/user', userRoutes);
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;