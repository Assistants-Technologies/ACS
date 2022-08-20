const express = require('express')
const router = express.Router()

const Project = require('../../../../../models/DBDStats/dbd_project')
const Views = require('../../../../../models/DBDStats/Views/view')
const User = require('../../../../../models/user')
const DiscordDashboard = require('../../../../../models/discordDashboard')

const getPlanStatus = require('./dbd_subscriptions/getStatus')

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

require('./dbd_subscriptions/runner')({client})

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
        if(!req.session.user)
            return res.send({error:true,message:"You are not logged in."})
        const user = await User.findOne({
            _id: req.session.user._id,
        })
        const {session_id} = (req.query || {})

        if(!session_id){
            return res.status(400).json({
                error: true,
                message: 'Missing required fields',
            })
        }

        const session = await stripe.checkout.sessions.retrieve(session_id)
        if(session?.status != "complete"){
            return res.status(400).json({
                error: true,
                message: 'Payment wasn\'t completed. Was it? Contact us: billing@assistantscenter.com',
            })
        }

        let discordDashboardUser = await DiscordDashboard.findOne({
            user: req.session.user._id
        })
        if(!discordDashboardUser)discordDashboardUser = await DiscordDashboard.create({
            user: req.session.user._id
        })

        const subscription = await stripe.subscriptions.retrieve(session.subscription)

        discordDashboardUser.plan = {
            plan_type: 'premium',
            subscription,
            active: true,
            active_until: new Date(subscription.current_period_end*1000),
            session
        }

        await discordDashboardUser.save()

        try{
            client.guilds.cache.get(process.env.DISCORD_GUILD_ID).channels.cache.get(process.env.DISCORD_LOGS_CHANNEL_ID).send(`Start plan for ${discordDashboardUser.user}`)
        }catch(err){}

        return res.send(subscription)
    })

router.route('/create/premium')
    .get(async(req,res)=>{
        if(!req.session.user)
            return res.send({error:true,message:"You are not logged in."})
        const user = await User.findOne({
            _id: req.session.user._id,
        })

        const status = await getPlanStatus(user._id)
        if(status.type == 'premium' && status.active){
            return res.send({error:true,message:"You have Premium Status active already"})
        }

        if(!user.stripe_customer){
            const stripe_customer = await stripe.customers.create({
                description: `user with _id ${user._id}`,
                email: user.verified ? user.email : null,
            })
            user.stripe_customer = stripe_customer.id
            await user.save()
        }

        const customer = await stripe.customers.retrieve(user.stripe_customer)

        const premium_price = process.env.DBD_PREMIUM_PRICE

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card', 'blik'],
            customer: customer.id,
            line_items: [
              {
                price: premium_price,
                quantity: 1
              }
            ],
            success_url: process.env.DBD_PREMIUM_SUCCESS_URL,
            cancel_url: process.env.DBD_PREMIUM_CANCEL_URL
          })

        res.redirect(303, session.url)
    })

module.exports = router