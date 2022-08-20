const mongoose = require('mongoose')

const DiscordDashboard = mongoose.model('DiscordDashboard',
    new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true, default: null, unique: true },
        projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DBDProject', sparse: true, default: null }],
        plan: {
            plan_type: {
                type: String,
                default: 'free'
            },

            subscription: {
                type: Object,
                sparse: true,
                default: null
            },

            active: {
                type: Boolean,
                default: false
            },
            active_until: {
                type: Date,
                sparse: true,
                default: null
            },

            session: {
                type: Object,
                sparse: true,
                default: null
            },
        }
    })
);

module.exports = DiscordDashboard