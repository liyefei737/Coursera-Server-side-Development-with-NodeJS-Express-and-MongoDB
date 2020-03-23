const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user_model');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');

opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

module.exports = passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(`jwt payload: ${jwt_payload}`);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
            return done(err);
        } else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })

}));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports.local = passport.use(new LocalStrategy(User.authenticate()));

module.exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey);
};

module.exports.verfiyAdmin = (req, res, next) => {
    console.log('verifying admin');
    console.log(`${req.user}`);
    
    
    if (req.user.isAdmin) {
        next();
    } else {
        const error = new Error('"You are not authorized to perform this operation!');
        error.status = 403;
        next(error);
    }
};

module.exports.verifyUser = passport.authenticate('jwt', { session: false });



