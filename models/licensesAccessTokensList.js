const mongoose = require('mongoose');

const LicensesAccessTokensList = mongoose.model('licensesATL',
    new mongoose.Schema({
        access_token: {
            type: String,
            required: true,
        },
        used: {
            type: Boolean,
            default: false,
        }
    })
);

module.exports = LicensesAccessTokensList;