const mongoose = require('mongoose')
const {
    Schema
} = require('mongoose')

const shopPaymentSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        session_id: {
            type: String,
            required: true,
        },
        payment_intent: {
            type: String,
            required: true,
        },
        amount_subtotal: {
            type: Number,
            required: true,
        },
        amount_total: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        items_ids: {
            type: Array,
            required: true,
        },
        assigned: {
            type: Boolean,
            required: true
        },
        full_object: {
            type: Object,
            required: false,
            sparse: true,
        },
    },
    {
        timestamps: true,
    }
)

const ShopPayment = mongoose.model('ShopPayment', shopPaymentSchema)

module.exports = ShopPayment
