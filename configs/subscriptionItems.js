const uuidv4 = require('uuid').v4

const User = require('../models/user')
const LicensesList = require('../models/licensesList')
const mongoose = require("mongoose");
const DiscordDashboard = require('../models/discordDashboard')

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages ] })
client.login(process.env.DISCORD_BOT_TOKEN)

module.exports = (dev) => [
    {
        id: 'dbd_premium',
        name: "Discord-Dashboard Premium Plan",
        description: "DBD Premium Plan",
        prices: {
            "PLN": dev ? "price_1LYrcuKWxgCmg6SfjRPulIh4" : "price_1LZXxYKWxgCmg6SfnmPaZyyP",
            "EUR": dev ? "price_1LYrcuKWxgCmg6SfjRPulIh4" : "price_1LZXyRKWxgCmg6Sfih75TwL5",
            "USD": dev ? "price_1LYrcuKWxgCmg6SfjRPulIh4" : "price_1LZXy6KWxgCmg6SfPP5sA2PP",
            "GBP": dev ? "price_1LYrcuKWxgCmg6SfjRPulIh4" : "price_1LZXz3KWxgCmg6SfiDfijCvm"
        },
        prices_display: {
            "PLN": ["PLN", "10"],
            "EUR": ["EUR", "3"],
            "USD": ["USD", "3"],
            "GBP": ["GBP", "4"]
        },
        subscriptionPaid: async ({ subscription, session, user_id }) => {
            let UserDBDPremium = await DiscordDashboard.findOne({
                user: user_id
            })
            if(!UserDBDPremium)UserDBDPremium = await DiscordDashboard.create({
                user: user_id
            })

            UserDBDPremium.plan = {
                plan_type: 'premium',
                active_until: new Date(subscription.current_period_end*1000+172800000),
                subscription,
                session
            }
            await UserDBDPremium.save()
        },
        subscriptionRenewed: async ({ subscription, user_id }) => {
            let UserDBDPremium = await DiscordDashboard.findOne({
                user: user_id
            })
            if(!UserDBDPremium)UserDBDPremium = await DiscordDashboard.create({
                user: user_id
            })

            UserDBDPremium.plan = {
                plan_type: 'premium',
                active_until: new Date(subscription.current_period_end*1000+172800000),
                subscription: subscription,
                session: UserDBDPremium.session
            }
            await UserDBDPremium.save()
        },
        canStart: async ({ user_id }) => {
            const UserDBDPremium = await DiscordDashboard.findOne({
                user: user_id
            })
            if(!UserDBDPremium)return true
            if(UserDBDPremium.plan?.plan_type == "premium")
                return "Your plan is still valid."
            return true
        },
        success_url: process.env.STRIPE_DBD_PREMIUM_SUCCESS_URL,
        cancel_url: process.env.STRIPE_DBD_PREMIUM_CANCEL_URL
    }
]