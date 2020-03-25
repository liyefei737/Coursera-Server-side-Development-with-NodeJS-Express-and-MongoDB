var express = require('express');
var router = express.Router();
const User = require('../models/user_model');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

// const debug = (req,res,next) => {
//     console.log(`header: \n${JSON.stringify(req.headers)}`);
//     console.log(`body: \n${JSON.stringify(req.headers)}`);
//     next();
// }

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verfiyAdmin, function (req, res, next) {
    User.find({}).then((users) => {
        res.status(200).json(users.map(user => {
            return {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
            };
        }));
    }).catch((err) => {
        next(err);
    });

});

router.post('/signup',cors.corsWithOptions, (req, res, next) => {
    User.register(new User({
        username: req.body.username,
        firstName: req.body.firstName || '',
        lastName: req.body.lastName || ''
    }), req.body.password, (err, user) => {
        console.log(`${req.body.username} :${req.body.password}`);

        if (err) {
            res.status(500).json({
                err: err
            });
        } else {
            console.log(`req body: ${JSON.stringify(req.body)}`);
            console.log(`signup user: ${JSON.stringify(user)}`);

            user.save((err, user) => {
                if (err) {
                    res.status(500).json({
                        err: err
                    });
                } else {
                    passport.authenticate('local')(req, res, () => {
                        res.status(200).json({
                            signupStatus: true
                        });
                    });
                }
            });
        }

    });
});

router.all('/login',cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
    console.log('logging in');
    
    const token = authenticate.getToken({
        _id: req.user._id
    });
    res.status(200).json({
        loginStatus: true,
        jwt: token
    });
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

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) {
        const token = authenticate.getToken({
            _id: req.user._id
        });
        res.status(200).json({
            loginStatus: true,
            jwt: token
        });

    }
});

module.exports = router;