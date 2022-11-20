const mongoose = require('mongoose')

const Addon = mongoose.model('Addon',
    new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true, default: null, unique: true },
        parent_id: { type: String },
        addon_id: { type: String }
    })
);

module.exports = Addon
