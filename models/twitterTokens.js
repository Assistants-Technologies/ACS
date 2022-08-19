const mongoose = require('mongoose');

const TwitterTokens = mongoose.model('TwitterTokens',
    new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true, default: null },
        acceess_token: { type: String, required: true },
        refresh_token: { type: String, required: true },
    })
);

module.exports = TwitterTokens