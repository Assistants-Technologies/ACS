const express = require('express')
const router = express.Router()

const Project = require('../../../../../models/DBDStats/dbd_project')
const Views = require('../../../../../models/DBDStats/Views/view')
const User = require('../../../../../models/user')
const DiscordDashboard = require('../../../../../models/discordDashboard')
const CheckoutSession = require('../../../../../models/Shop/checkoutSession')

const {v4} = require('uuid')

const { Stripe } = require('stripe');
const stripe = new Stripe((process.env.DEVELOPMENT_CHANNEL === "TRUE" || process.env.BETA_CHANNEL === "TRUE") ? process.env.STRIPE_SK_DEV : process.env.STRIPE_SK_LIVE, {
    apiVersion: 'latest',
    appInfo: {
        name: "assistants_services/shop",
        version: "0.0.1",
        url: process.env.DOMAIN_URL
    }
})

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages ] })
client.login(process.env.DISCORD_BOT_TOKEN)

const SubscriptionItems = require('../../../../../configs/subscriptionItems')(process.env.DEVELOPMENT_CHANNEL === "TRUE" || process.env.BETA_CHANNEL === "TRUE")

router.route('/')
    .get(async(req,res)=>{
        if(!req.session.user)
            return res.send({error:true,message:"You are not logged in."})
        const user = await User.findOne({
            _id: req.session.user._id,
        })
    })

router.route('/success')
    .get(async(req,res)=>{
        const {session_id = ''} = req.query
        return req.next_app.render(req, res, '/wait-for-items-assign', {
            url: req.url,
            session_id: session_id,
            redirect: '/discord-dashboard'
        })
    })

router.route('/cancel')
    .get(async(req,res)=>{
        const {session_id = ''} = req.query
        return res.redirect(`/discord-dashboard?session_id=${session_id}&action=canceled`)
    })

router.route('/create/:subscription_id')
    .get(async(req,res)=>{
        if(!req.session.user)
            return res.send({error:true,message:"You are not logged in."})
        
        const Subscription = SubscriptionItems.find(sub=>sub.id==req.params.subscription_id)
        if(!Subscription)
            return res.send({error:true,message:"Subscription not valid"})

        
        const { currency = "EUR" } = req?.query;

        const currenciesList = Object.keys(Subscription.prices_display);
        if(!currenciesList.includes(currency)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid currency',
            })
        }

        const can_start = await Subscription.canStart({ user_id: req.session.user._id })
        if(can_start != true){
            return res.send({error:true,message:can_start})
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

        const plan_price = Subscription.prices[currency]

        const checkout_metadata_key = v4()

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer: customer.id,
            line_items: [
              {
                price: plan_price,
                quantity: 1
              }
            ],
            success_url: Subscription.success_url,
            cancel_url: Subscription.cancel_url,
            metadata: {'subscription_id': req.params.subscription_id, 'checkout_metadata_key': checkout_metadata_key }
          })

          await CheckoutSession.create({
            user: req.session.user._id,
            item_type: "subscription",
            session_data: session,
            subscription_id: req.params.subscription_id,
            checkout_metadata_key
          })

        res.redirect(303, session.url)
    })

module.exports = router