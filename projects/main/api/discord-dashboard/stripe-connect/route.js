const express = require('express')
const router = express.Router()

const { Stripe } = require('stripe');
const stripe = new Stripe((process.env.DEVELOPMENT_CHANNEL === "TRUE" || process.env.BETA_CHANNEL === "TRUE") ? process.env.STRIPE_SK_DEV : process.env.STRIPE_SK_LIVE, {
    apiVersion: 'latest',
    appInfo: {
        name: "assistants_services/shop",
        version: "0.0.1",
        url: process.env.DOMAIN_URL
    }
})

const StripeAccount = require('../../../../../models/DiscordDashboardV3/stripeAccount')

router.get('/', async (req,res)=>{
    if(!req.session.user){
        return res.redirect('/auth?redirect_back=/discord-dashboard')
    }

    let stripe_user_account = await StripeAccount.findOne({
        user: req.session.user._id
    })
    if(!stripe_user_account) {
        const account = await stripe.accounts.create({type: 'standard'})
        stripe_user_account = await StripeAccount.create({
            user: req.session.user._id,
            account_id: account.id
        })
    }

    const accountLink = await stripe.accountLinks.create({
        account: stripe_user_account.account_id,
        refresh_url: 'http://localhost:3000/api/discord-dashboard/stripe-connect',
        return_url: 'http://localhost:3000/api/discord-dashboard/stripe-connect/return',
        type: 'account_onboarding',
    })

    res.redirect(accountLink.url)
})

router.get('/return', async (req,res) => {
    if(!req.session.user){
        return res.redirect('/auth?redirect_back=/discord-dashboard')
    }
    let stripe_user_account = await StripeAccount.findOne({
        user: req.session.user._id
    })
    if(!stripe_user_account)
        return res.redirect('/discord-dashboard?error=No stripe account connected found. Please, try again.')

    const account = await stripe.accounts.retrieve(stripe_user_account.account_id)
    if(!account.details_submitted)
        return res.redirect('/discord-dashboard?error=Details not submitted. Try again.')

    return res.redirect('/discord-dashboard?info=Stripe details submitted successfully.')
})

router.get('/callback', (req,res)=>{
    res.send({error:true,message:"returned!"})
})

module.exports = router