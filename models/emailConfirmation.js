const mongoose = require('mongoose')

const EmailConfirmation = mongoose.model('EmailConfirmation',
    new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        confirm_token: { type: String, required: true },
    })
)

module.exports = EmailConfirmation