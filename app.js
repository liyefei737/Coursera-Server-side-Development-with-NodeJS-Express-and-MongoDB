var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

// mongoose models
const Dish = require('./models/dish_model');

//connection
const url = 'mongodb://localhost:27017/conFusion';
const connection = mongoose.connect(url,
  { poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true, useUnifiedTopology: true });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//custome basic http authentication

function basicAuth(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic');
    const err = new Error('no username and password passed');
    err.status = 401;
    next(err);
  } else {
    login_creds = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    const uname = login_creds[0];
    const pword = login_creds[1];
    console.log(`uname ${uname} password: ${pword}`);
    
    if (uname === 'admin' && pword === 'password') {
      next(); //allow this req to be handled by all other middleware follows
    } else {
      console.log('bad un and pw');
      res.setHeader('WWW-Authenticate', 'Basic');
      const err = new Error('no username and password passed');
      err.status = 401;
      next(err);

    }
  }
}

app.use(basicAuth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promos', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(`error code is ${err.status}`);
  
  res.render('error');
});

module.exports = app;
