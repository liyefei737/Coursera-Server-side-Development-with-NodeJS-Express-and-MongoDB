var express = require('express');
var router = express.Router();
const User = require('../models/user_model');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      const err = new Error(`User ${req.body.username} already exists`);
      err.status = 403;
      next(err);
    } else {
      return User.create({
        username: req.body.username,
        password: req.body.password
      });
    }
  }).then((user) => {
    res.status(200).json({
      signupStatus: 'success'
    });
  }).catch((err) => next(err));
});

router.all('/login', (req, res, next) => {

  if (!req.session.user) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.setHeader('WWW-Authenticate', 'Basic');
      const err = new Error('no username and password passed');
      err.status = 401;
      next(err);
    } else {
      login_creds = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const username = login_creds[0];
      const password = login_creds[1];

      User.findOne({ 'username': username }).then((user) => {
        // user should be a proper value here
        if (!user || password !== user.password || username !== user.username) {
          throw new Error();
        } else {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.end('you are logged in.');
        }
      }).catch(() => {
        const err = new Error(`incorrect login credentials`);
        err.status = 403;
        next(err);
      });

    }

  } else {
    res.statusCode = 200;
    res.end('you are already logged in.');
  }

});


router.get('/logout', (req, res, next) => {
  if (req.session) {

    req.session.destroy('sess_id'); // delete the session data on the server side
    res.clearCookie('sess_id'); // clear cookie with this session id on the client
    res.redirect('/');
  } else {
    const err = new Error(`Cannot log out: User not logged in yet.`);
    err.status = 403;
    next(err);
  }
});
module.exports = router;
