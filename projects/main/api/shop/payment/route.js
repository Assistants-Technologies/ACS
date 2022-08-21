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
});

const ShopPayment = require('../../../../../models/Shop/payment')
const User = require('../../../../../models/user')

router.get('/create', async (req, res) => {
    if(!req.session?.user){
        return res.status(400).json({
            error:true,
            message: "Not authenticated"
        })
    }
    const { items: itemsFromQuery, currency } = req?.query;

    const countriesList = Object.keys(paymentTypes);
    if(!countriesList.includes(currency)) {
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

    const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        line_items: paymentItemsList,
        mode: 'payment',
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        payment_method_types: paymentTypes[currency],
        payment_intent_data: {
            receipt_email: user.verified ? user.email : null,
        },
        /*discounts: [
            {
                coupon: 'nhSqiNs9'
            }
        ],*/
    });

    await ShopPayment.create({
        user: req.session.user._id,
        session_id: session.id,
        payment_intent: session.payment_intent,
        amount_subtotal: session.amount_subtotal,
        amount_total: session.amount_total,
        currency: session.currency.toUpperCase(),
        status: session.status,
        items_ids: itemsList,
        assigned: false,
        full_object: session,
    })

    res.redirect(303, session.url);
});


router.get('/success', async (req, res) => {
    const { session_id } = req?.query
    if(!session_id){
        return res.status(400).json({
            error: true,
            message: 'Missing required fields',
        })
    }

    const Session = await ShopPayment.findOne({
        session_id,
    })
    if(!Session){
        return res.status(400).json({
            error: true,
            message: "Invalid session"
        })
    }

    const session = await stripe.checkout.sessions.retrieve(session_id)
    if(session?.status != "complete"){
        return res.status(400).json({
            error: true,
            message: 'Payment wasn\'t completed. Was it? Contact us: billing@assistantscenter.com',
        })
    }

    if(Session.assigned) {
        return res.status(400).json({
            error: true,
            message: 'Payment was already assigned',
        })
    }

    for(const item of Session.items_ids){
        await (items.find(e=>e.id==item)).assign_item({ Session })
    }

    Session.assigned = true;
    Session.status = "complete";
    await Session.save();

    return res.redirect(`/shop?purchase_state=complete&purchased=${Session.items_ids.join(',')}&session_id=${Session.session_id}`);
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