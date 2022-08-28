const express = require('express')
const router = express.Router()

const {items, paymentTypes} = require(__configs + 'items')((process.env.DEVELOPMENT_CHANNEL === "TRUE" || process.env.BETA_CHANNEL === "TRUE"))

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

const SubscriptionItems = require(__configs + '/subscriptionItems')(process.env.DEVELOPMENT_CHANNEL === "TRUE" || process.env.BETA_CHANNEL === "TRUE")

const ShopPayment = require(__models + 'Shop/payment')
const CheckoutSession = require(__models + 'Shop/checkoutSession')
const DiscordDashboard = require(__models + 'discordDashboard')
const User = require(__models + 'user')
const Partnership = require(__models + 'partnership')

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

                const reason = invoiceIntent.billing_reason
                if(!reason)break

                const sub_info = await stripe.subscriptions.retrieve(sub)
                if(!sub_info)break

                const CheckoutDataFromSub = await CheckoutSession.findOne({
                    checkout_metadata_key: sub_info.metadata.checkout_metadata_key,
                })
                if(!CheckoutDataFromSub)break

                const SubscriptionItemFound = SubscriptionItems.find(sub=>sub.id==CheckoutDataFromSub.subscription_id)
                if(!SubscriptionItemFound)break

                if(reason == 'subscription_create') {
                    await SubscriptionItemFound.subscriptionPaid({
                        subscription: sub_info,
                        user_id: CheckoutDataFromSub.user,
                        session: CheckoutDataFromSub,
                    })
                }else if(reason == 'subscription_cycle') {
                    await SubscriptionItemFound.subscriptionRenewed({
                        subscription: sub_info,
                        user_id: CheckoutDataFromSub.user,
                    })
                }else break

                CheckoutDataFromSub.session_finished_data = invoiceIntent
                await CheckoutDataFromSub.save()

                let partner_user_sub
                if(CheckoutDataFromSub.partner_supported){
                    partner_user_sub = await Partnership.findOne({
                        user: CheckoutDataFromSub.partner_supported
                    })
                }

                if(partner_user_sub){
                    partner_user_sub.user_partnership_actions.push({
                        action_type: "purchase",
                        action_target: {
                            target_type: "subscription",
                            target_id: SubscriptionItemFound.id,
                            target_currency: invoiceIntent.currency.toUpperCase(),
                            target_price: invoiceIntent.amount_paid,
                        },
                        action_date: new Date(),
                        action_checkout_session_id: CheckoutDataFromSub._id,
                    })
                }

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
                                action_date: new Date(),
                                action_checkout_session_id: SessionAsyncData._id,
                            })
                        }
                    }

                    if(partner_user_async){
                        await partner_user.save()
                    }

                    SessionAsyncData.session_finished_data = checkoutAsyncIntent
                    await SessionAsyncData.save()
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
                                action_date: new Date(),
                                action_checkout_session_id: SessionData._id,
                            })
                        }
                    }

                    if(partner_user){
                        await partner_user.save()
                    }

                    SessionData.session_finished_data = checkoutIntent
                    await SessionData.save()
                }

                break
            default:
                break
          }

        return res.send()
    })


module.exports = router