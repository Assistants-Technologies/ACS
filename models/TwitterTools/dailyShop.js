const mongoose = require('mongoose')

const DailyShop = mongoose.model('DailyShop',
    new mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        enabled: { type: Boolean, default: false },
        sac: { type: String, default: 'ASSISTANTS', },
        lang: { type: String, default: 'en', },
        message_content: { type: String, default: '' }
    })
)

module.exports = DailyShop