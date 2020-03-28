const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);



const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'dish' }]
}, { timestamps: true });


const favorite_model = mongoose.model('Favorite', favoriteSchema);

module.exports = favorite_model;