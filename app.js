var express     = require('express');
var cors = require('cors')
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// initialize the express server app:
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// client is served statically under '/':
if (process.env.LAUNCH_CLIENT)
    app.use(express.static(process.env.CLIENT_STATIC_PATH));

// Options:
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Setup database:
require('./database/init')();

// Initialize the users app:
require('./users/init')(app);

// Setup routes:

/* API ROUTES: */
var users = require('./users/routes');
app.use('/api/users', users);

var gifts = require('./gifts/routes');
var jwtService = require('./users/jwt.js');
app.use('/api/', jwtService.jwtTokenMiddleware, gifts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;