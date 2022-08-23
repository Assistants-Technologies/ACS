const mongoose = require('mongoose');

const Partnership = mongoose.model('Partnership',
    new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        user_partnership_id: {
            type: String,
            required: true,
            unique: true
        },
        user_partnership_actions: {
            type: Array,
            default: []
        },
        user_partnership_worth: {
            type: Number,
            default: 0,
        }
    })
);

module.exports = Partnership