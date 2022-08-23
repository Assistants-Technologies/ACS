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

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages ] })
client.login(process.env.DISCORD_BOT_TOKEN)

client.guilds.fetch(process.env.DISCORD_GUILD_ID).then(guild=>{
    guild.channels.fetch(process.env.DISCORD_LOGS_CHANNEL_ID)
})

const SubscriptionItems = require('../../../../../configs/subscriptionItems')(process.env.DEVELOPMENT_CHANNEL === "TRUE" || process.env.BETA_CHANNEL === "TRUE")

const ShopPayment = require('../../../../../models/Shop/payment')
const CheckoutSession = require('../../../../../models/Shop/checkoutSession')
const DiscordDashboard = require('../../../../../models/discordDashboard')
const User = require('../../../../../models/user')
const Partnership = require('../../../../../models/partnership')

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

router.route('/assigned/:session_id')
    .get(async (req,res) => {
        const {session_id} = req.params

        const CheckoutData = await CheckoutSession.findOne({ 'session_data.id': session_id })
        if(!CheckoutData)return res.send({error:true,message:"Checkout invalid."})

        if(CheckoutData.session_finished_data){
            return res.send({error:false,finished:true})
        }else{
            return res.send({error:true,message:"Still waiting to finish."})
        }
    })

router.route('/')
    .post(async(req,res)=>{
        let event = req.body;

        if (endpointSecret) {
          const signature = req.headers['stripe-signature'];
          try {
            event = stripe.webhooks.constructEvent(
              req.body,
              signature,
              endpointSecret
            )
          } catch (err) {
            return res.status(400).send(err)
          }
        }

        switch (event.type) {
            case 'invoice.paid':
                const invoiceIntent = event.data.object
                const sub = invoiceIntent.subscription
                if(!sub)break

                const user_from_sub = await DiscordDashboard.findOne({'plan.subscription.id': sub})

                const SessionSubscription = await CheckoutSession.findOne({
                    _id: user_from_sub.session._id
                })
                if(!SessionSubscription?.session_finished_data)break

                try{
                    client.guilds.cache.get(process.env.DISCORD_GUILD_ID).channels.cache.get(process.env.DISCORD_LOGS_CHANNEL_ID).send(`Subscription renewed for ${SessionSubscription.user}`)
                }catch(err){
                    console.log(err)
                }

                const SubscriptionItem = SubscriptionItems.find(sub=>sub.id==SessionSubscription.subscription_id)
                const subscription_stripe = await stripe.subscriptions.retrieve(sub)

                await SubscriptionItem.subscriptionRenewed({ user_id: SessionSubscription.user, subscription: subscription_stripe })
                break
            case 'checkout.session.async_payment_succeeded':
                const checkoutAsyncIntent = event.data.object
                const SessionAsyncData = await CheckoutSession.findOne({'session_data.id': checkoutAsyncIntent.id})
                if(!SessionAsyncData)break

                if(SessionAsyncData.session_finished_data)break

                let partner_user_async
                if(SessionAsyncData.partner_supported){
                    partner_user = await Partnership.findOne({
                        user: SessionAsyncData.partner_supported
                    })
                }

                if(SessionAsyncData.item_type == 'item'){
                    for(const item of SessionAsyncData.items_ids) {
                        await items.find(e=>e.id==item).assign_item({ session: checkoutAsyncIntent, user_id: SessionAsyncData.user })
                        if(partner_user_async){
                            partner_user_async.user_partnership_actions.push({
                                action_type: "purchase",
                                action_target: {
                                    target_type: "item",
                                    target_id: items.find(e=>e.id==item).id,
                                    target_currency: checkoutAsyncIntent.currency.toUpperCase(),
                                    target_price: checkoutAsyncIntent.amount_subtotal,
                                },
                                action_checkout_session_id: SessionAsyncData._id,
                            })
                        }
                    }

                    if(partner_user_async){
                        await partner_user.save()
                    }

                    SessionAsyncData.session_finished_data = checkoutAsyncIntent
                    await SessionAsyncData.save()
                }else if(SessionAsyncData.item_type == 'subscription'){
                    const SubscriptionItem = SubscriptionItems.find(sub=>sub.id==SessionAsyncData.subscription_id)
                    const subscription_stripe = await stripe.subscriptions.retrieve(checkoutAsyncIntent.subscription)

                    await SubscriptionItem.subscriptionPaid({ user_id: SessionAsyncData.user, session: SessionAsyncData, subscription: subscription_stripe })

                    SessionAsyncData.session_finished_data = checkoutAsyncIntent
                    await SessionAsyncData.save()

                    try{
                        client.guilds.cache.get(process.env.DISCORD_GUILD_ID).channels.cache.get(process.env.DISCORD_LOGS_CHANNEL_ID).send(`Subscription created for ${SessionAsyncData.user} using async payment`)
                    }catch(err){
                        console.log(err)
                    }
                }
                break
            case 'checkout.session.completed':
                const checkoutIntent = event.data.object
                if (checkoutIntent.payment_status != 'paid') break
                const SessionData = await CheckoutSession.findOne({'session_data.id': checkoutIntent.id})
                if(!SessionData)break

                if(SessionData.session_finished_data)break

                let partner_user
                if(SessionData.partner_supported){
                    partner_user = await Partnership.findOne({
                        user: SessionData.partner_supported
                    })
                }

                if(SessionData.item_type == 'item'){
                    for(const item of SessionData.items_ids) {
                        await items.find(e=>e.id==item).assign_item({ session: checkoutIntent, user_id: SessionData.user })
                        if(partner_user){
                            partner_user.user_partnership_actions.push({
                                action_type: "purchase",
                                action_target: {
                                    target_type: "item",
                                    target_id: items.find(e=>e.id==item).id,
                                    target_currency: checkoutIntent.currency.toUpperCase(),
                                    target_price: checkoutIntent.amount_subtotal,
                                },
                                action_checkout_session_id: SessionData._id,
                            })
                        }
                    }

                    if(partner_user){
                        await partner_user.save()
                    }

                    SessionData.session_finished_data = checkoutIntent
                    await SessionData.save()
                }else if(SessionData.item_type == 'subscription'){
                    const SubscriptionItem = SubscriptionItems.find(sub=>sub.id==SessionData.subscription_id)
                    const subscription_stripe = await stripe.subscriptions.retrieve(checkoutIntent.subscription)

                    await SubscriptionItem.subscriptionPaid({ user_id: SessionData.user, session: SessionData, subscription: subscription_stripe })

                    SessionData.session_finished_data = checkoutIntent
                    await SessionData.save()

                    try{
                        client.guilds.cache.get(process.env.DISCORD_GUILD_ID).channels.cache.get(process.env.DISCORD_LOGS_CHANNEL_ID).send(`Subscription created for ${SessionData.user} using instant payment`)
                    }catch(err){
                        console.log(err)
                    }
                }

                break
            default:
                break
          }

        return res.send()
    })


module.exports = router