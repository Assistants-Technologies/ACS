const express = require('express')
const router = express.Router()

const User = require('../../../../models/user')
const DiscordDashboard = require('../../../../models/discordDashboard')

const Partnership = require('../../../../models/partnership')

router.get('/', async (req,res)=>{
    if(!req.session?.user)
        return res.redirect('/auth?back_redirect=/partnership')
    
    const partner = await Partnership.findOne({
        user: req.session.user._id
    })

    return res.send({
        error: false,
        partnered: !!partner,
        partner_data: partner
    })
})

router.get('/apply', async (req,res)=>{
    if(!req.session?.user)
    return res.redirect('/auth?back_redirect=/partnership')

    let partner = await Partnership.findOne({
        user: req.session.user._id
    })

    if(partner)
        return res.send({error:true,message:"You are already partnered with us."})

    partner = await Partnership.create({
        user: req.session.user._id,
        user_partnership_id: req.session.user._id,
    })

    return res.send({error:false,partner_data: partner})
})

module.exports = router