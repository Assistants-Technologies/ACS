module.exports = ({client}) => {
    const { Stripe } = require('stripe');
    const stripe = new Stripe((process.env.DEVELOPMENT_CHANNEL === "TRUE" || process.env.BETA_CHANNEL === "TRUE") ? process.env.STRIPE_SK_DEV : process.env.STRIPE_SK_LIVE, {
        apiVersion: 'latest',
        appInfo: {
            name: "assistants_services/shop",
            version: "0.0.1",
            url: process.env.DOMAIN_URL
        }
    })

    const DiscordDashboard = require('../../../../../../models/discordDashboard')

    const validate = async () => {
        const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID)
        await guild.channels.fetch(process.env.DISCORD_LOGS_CHANNEL_ID)

        const All_Subscriptions = await DiscordDashboard.find({})
        for(const Subscription of All_Subscriptions){
            if(Subscription.plan?.plan_type == 'premium' && (Date.now() > Subscription.plan?.active_until)){
                const subscription = await stripe.subscriptions.retrieve(Subscription.plan.subscription.id)
                if(subscription.status != "active"){
                    try{
                        await stripe.subscriptions.cancel(Subscription.plan.subscription.id)
                    }catch(err){}

                    const Plan_To_Downgrade = await DiscordDashboard.findOne({
                        _id: Subscription._id,
                    })

                    Plan_To_Downgrade.plan = {
                        plan_type: 'free',
                        subscription: null,
                        active: false,
                        active_until: null,
                        session: null,
                    }

                    await Plan_To_Downgrade.save()

                    try{
                        client.guilds.cache.get(process.env.DISCORD_GUILD_ID).channels.cache.get(process.env.DISCORD_LOGS_CHANNEL_ID).send(`Downgrade plan for ${Plan_To_Downgrade.user}`)
                    }catch(err){}

                    /*
                        Send e-mail "your subscription has expired, premium plan disabled"
                        Disable 9 of 10 DBD Projects
                    */
                }else{
                    try{
                        client.guilds.cache.get(process.env.DISCORD_GUILD_ID).channels.cache.get(process.env.DISCORD_LOGS_CHANNEL_ID).send(`Subscription expired for ${Plan_To_Update.user}? (checking for latest invoice)`)
                    }catch(err){
                    }
                    const latest_invoice = await stripe.invoices.retrieve(Subscription.plan.subscription.latest_invoice)

                    if(latest_invoice.status == 'uncollectible'){
                        try{
                            await stripe.subscriptions.cancel(Subscription.plan.subscription.id)
                        }catch(err){}
    
                        const Plan_To_Downgrade = await DiscordDashboard.findOne({
                            _id: Subscription._id,
                        })
    
                        Plan_To_Downgrade.plan = {
                            plan_type: 'free',
                            subscription: null,
                            active: false,
                            active_until: null,
                            session: null,
                        }
    
                        await Plan_To_Downgrade.save()
    
                        try{
                            client.guilds.cache.get(process.env.DISCORD_GUILD_ID).channels.cache.get(process.env.DISCORD_LOGS_CHANNEL_ID).send(`Downgrade plan for ${Plan_To_Downgrade.user} (invoice not paid on renew)`)
                        }catch(err){}
                    }else if(latest_invoice.status == 'paid'){
                        const Plan_To_Update = await DiscordDashboard.findOne({
                            _id: Subscription._id,
                        })
    
                        Plan_To_Update.plan = {
                            plan_type: 'premium',
                            subscription,
                            active: true,
                            active_until: new Date(subscription.current_period_end*1000),
                            session: Plan_To_Update.session,
                        }
    
                        await Plan_To_Update.save()
    
                        try{
                            client.guilds.cache.get(process.env.DISCORD_GUILD_ID).channels.cache.get(process.env.DISCORD_LOGS_CHANNEL_ID).send(`Renew plan for ${Plan_To_Update.user} (invoice paid, so real renew)`)
                        }catch(err){
                        }
                    }else{
                        try{
                            client.guilds.cache.get(process.env.DISCORD_GUILD_ID).channels.cache.get(process.env.DISCORD_LOGS_CHANNEL_ID).send(`Renew plan for ${Plan_To_Update.user} (still waiting)`)
                        }catch(err){
                        }
                    }
                }
            }
        }
    }

    validate()
    setInterval(validate, 3600000/6) // 10m
}