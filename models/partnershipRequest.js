const mongoose = require('mongoose');

const PartnershipRequest = mongoose.model('PartnershipRequest',
    new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        confirmed: { type: Boolean, default: null, sparse: true },
        denied_message: { type: String, default: null, sprase: true },
        about: { type: String, default: '' },
        code_requested: { type: String, required: true },
        email: { type: String, }
    })
);

module.exports = PartnershipRequest