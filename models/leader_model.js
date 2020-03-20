const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    abbr: {
        type: String,
        default: ''
    },
    designation: {
        type: String,
        default: ''
    },
    feature: {
        type: Boolean,
        default: false
    }
},{timestamps: true});


const leader_model = mongoose.model('leader',leaderSchema);

module.exports = leader_model;