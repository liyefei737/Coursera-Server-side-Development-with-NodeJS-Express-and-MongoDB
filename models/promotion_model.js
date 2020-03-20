const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

// a new type for currency
const Currency = mongoose.Types.Currency;


const promoSchema = new mongoose.Schema({
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
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    feature: {
        type: Boolean,
        default: false
    }
},{timestamps: true});


const promo_model = mongoose.model('promotion',promoSchema);

module.exports = promo_model;