var express = require('express');
var router = express.Router();
const User = require('../models/user_model');
const passport = require('passport');
const authenticate = require('../authenticate');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
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

router.all('/login', passport.authenticate('local'), (req, res) => {
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

module.exports = router;