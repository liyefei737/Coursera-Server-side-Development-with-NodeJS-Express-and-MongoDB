const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default:false
    }
},{timestamps: true});


const user_model = mongoose.model('user',userSchema);

module.exports = user_model;