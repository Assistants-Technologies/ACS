const mongoose = require('mongoose');

const LicensesList = mongoose.model('LicensesList',
    new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true, default: null },
        payment_id: String,
        license_id: String,
        license_type: String,
        itemID: Number
    })
);

module.exports = LicensesList;