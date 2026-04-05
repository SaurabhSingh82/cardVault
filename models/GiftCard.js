const mongoose = require('mongoose');




const giftCardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cardNumber: {
    type: String,
    required: true
    },
    pin: {
    type: String,
    required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('GiftCard', giftCardSchema);