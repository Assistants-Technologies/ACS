const mongoose = require('mongoose')
const {
    Schema
} = require('mongoose')

const checkoutSessionSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        item_type: {
            type: String,
            default: 'item', // item or subscription
        },
        session_data: {
            type: Object,
        },
        session_finished_data: {
            type: Object,
        },
        items_ids: {
            type: Array,
        },
        subscription_id: {
            type: String
        }
    },
    {
        timestamps: true,
    }
)

const CheckoutSession = mongoose.model('CheckoutSession', checkoutSessionSchema)

module.exports = CheckoutSession
