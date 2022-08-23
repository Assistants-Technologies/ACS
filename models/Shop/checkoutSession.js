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
        partner_supported: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
            sparse: true
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
        },
        checkout_metadata_key: { 
            type: String
        }
    },
    {
        timestamps: true,
    }
)

const CheckoutSession = mongoose.model('CheckoutSession', checkoutSessionSchema)

module.exports = CheckoutSession
