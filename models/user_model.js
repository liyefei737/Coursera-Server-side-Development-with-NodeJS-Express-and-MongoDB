const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: false
    },
    firstName: {
        type: String,
        defalult: ''
    },
    lastName: {
        type: String,
        defalult: ''
    }
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);

const user_model = mongoose.model('user', userSchema);

module.exports = user_model;