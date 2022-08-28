const mongoose = require('mongoose')

const StripeAccount = mongoose.model('StripeAccount',
    new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        account_id: { type: String, required: true, },
    })
)

module.exports = StripeAccount