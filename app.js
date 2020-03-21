var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const sessionFileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');
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
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('sdkjfdkjfjksldfljksdlfkjsdjklf'));
app.use(session({  // will add req.session to the request message
  name: 'sess_id',
  secret: 'dfklgjfdkljgdfkljgdflkgjdfkl',
  saveUninitialized: 'false',
  store: false,
  store: new sessionFileStore()
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//custome basic http authentication

function auth(req, res, next) {

  console.log(` signed cookie: ${JSON.stringify(req.signedCookies)}`);
  console.log(` unsigned cookie: ${JSON.stringify(req.cookies)}`);
  console.log(` session: ${JSON.stringify(req.session)}`);
  if (!req.session.user) {
    console.log(`unlogged-in user tries to perform authorized action.`);
    
    res.statusCode = 401;
    res.end('you need to login to perform this action.');
  } else {
    next();
  }
}

app.use(auth);


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
