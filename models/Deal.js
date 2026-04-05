const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GiftCard',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'disputed','refunded'],
        default: 'pending'
    },
    expiresAt: {
    type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);