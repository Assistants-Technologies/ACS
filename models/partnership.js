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
    })
);

module.exports = Partnership