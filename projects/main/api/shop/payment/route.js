const express = require('express')
const router = express.Router()

const {items, paymentTypes} = require('../../../../../configs/items')((process.env.DEVELOPMENT_CHANNEL === "TRUE" || process.env.BETA_CHANNEL === "TRUE"))

const { Stripe } = require('stripe');
const stripe = new Stripe((process.env.DEVELOPMENT_CHANNEL === "TRUE" || process.env.BETA_CHANNEL === "TRUE") ? process.env.STRIPE_SK_DEV : process.env.STRIPE_SK_LIVE, {
    apiVersion: 'latest',
    appInfo: {
        name: "assistants_services/shop",
        version: "0.0.1",
        url: process.env.DOMAIN_URL
    }
})

const { v4 } = require('uuid')

const ShopPayment = require('../../../../../models/Shop/payment')
const CheckoutSession = require('../../../../../models/Shop/checkoutSession')
const User = require('../../../../../models/user')
const Partnership = require('../../../../../models/partnership')

router.get('/create', async (req, res) => {
    if(!req.session?.user){
        return res.status(400).json({
            error:true,
            message: "Not authenticated"
        })
    }
    const { items: itemsFromQuery, currency, referral_code } = req?.query;

    let partner_user
    if(referral_code){
        partner_user = await Partnership.findOne({
            user_partnership_id: referral_code
        })
    }

    const currenciesList = Object.keys(paymentTypes);
    if(!currenciesList.includes(currency)) {
        return res.status(400).json({
            error: true,
            message: 'Invalid currency',
        })
    }

    if(!itemsFromQuery || !currency) {
        return res.status(400).json({
            error: true,
            message: 'Missing required fields',
        })
    }

    let paymentItemsList = [];

    const itemsList = itemsFromQuery.split(',')
    for(let itemObj of itemsList){
        if(!items.find(e=>e.id==itemObj))
            return res.status(400).json({
                error: true,
                message: 'Invalid itemId',
            })

        const found = paymentItemsList.findIndex(e=>e.price==items.find(e=>e.id==itemObj).prices[currency])
        if(found == -1 || found == null){
            paymentItemsList.push({
                price: items.find(e=>e.id==itemObj).prices[currency],
                quantity: 1,
            })
        }else{
            paymentItemsList[found] = {
                price: items.find(e=>e.id==itemObj).prices[currency],
                quantity: paymentItemsList[found].quantity+1,
            }
        }
    }

    const user = await User.findOne({
        _id: req.session.user._id,
    })

    if(!user.stripe_customer){
        const stripe_customer = await stripe.customers.create({
            description: `user with _id ${user._id}`,
            email: user.verified ? user.email : null,
        })
        user.stripe_customer = stripe_customer.id
        await user.save()
    }

    const customer = await stripe.customers.retrieve(user.stripe_customer)

    const checkout_metadata_key = v4()

    const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        line_items: paymentItemsList,
        mode: 'payment',
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        automatic_payment_methods: {enabled: true},
        payment_intent_data: {
            receipt_email: user.verified ? user.email : undefined,
        },
        metadata: {
            'checkout_metadata_key': checkout_metadata_key
        }
        /*discounts: [
            {
                coupon: 'nhSqiNs9'
            }
        ],*/
    });

    await CheckoutSession.create({
        user: req.session.user._id,
        partner_supported: partner_user ? partner_user.user : undefined,
        item_type: 'item',
        session_data: session,
        items_ids: itemsList,
        checkout_metadata_key
    })
    res.redirect(303, session.url);
});


router.get('/success', async (req, res) => {
    const {session_id = ''} = req.query
    return req.next_app.render(req, res, '/wait-for-items-assign', {
        url: req.url,
        session_id: session_id,
        redirect: '/shop'
    })
})


router.get('/cancel', (req,res)=>{
    const { session_id } = req?.query
    if(!session_id){
        return res.status(400).json({
            error: true,
            message: 'Missing required fields',
        })
    }

    res.redirect(`/shop?purchase_state=canceled%20or%20expired&session_id=${session_id}`)
})


module.exports = router
