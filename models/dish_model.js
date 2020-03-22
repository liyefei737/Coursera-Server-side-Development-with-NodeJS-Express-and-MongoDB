const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

// a new type for currency
const Currency = mongoose.Types.Currency;

const commentSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
},{timestamps:true});


const dishSchema = new mongoose.Schema({
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
    category: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
    },
    feature: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
},{timestamps: true});


const dish_model = mongoose.model('dish',dishSchema);

module.exports = dish_model;