const express = require('express')
const router = express.Router()

const User = require('../../../../models/user')
const DiscordDashboard = require('../../../../models/discordDashboard')

const Partnership = require('../../../../models/partnership')
const PartnershipRequest = require('../../../../models/partnershipRequest')

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
}

router.get('/', async (req,res)=>{
    if(!req.session?.user)
        return res.redirect('/auth?back_redirect=/partnership')
    
    const partner = await Partnership.findOne({
        user: req.session.user._id
    })

    let request_status = null

    if(!partner){
        request_status = ((await PartnershipRequest.find({
            user: req.session.user._id,
        }).sort({ _id: -1 }).limit(1)) || [null])[0]
    }

    return res.send({
        error: false,
        partnered: !!partner,
        partner_data: partner,
        request_status
    })
})

router.post('/apply', async (req,res)=>{
    if(!req.session?.user)
        return res.send({
            error: true,
            message: "Not authorized."
        })

    let partner = await Partnership.findOne({
        user: req.session.user._id
    })

    if(partner)
        return res.send({
            error:true,
            message:"You are already partnered with us."
        })
    
    const user_requests = await PartnershipRequest.find({user: req.session.user._id})

    for(const request of user_requests) {
        if(request.confirmed == null)
            return res.send({
                error: true,
                message: "We've already received your ticket. Please wait for response."
            })
    }
    
    let { about, code_requested, email } = req.body

    if(!about || !code_requested || !email)
        return res.send({
            error: true,
            message: "Missing required fields."
        })
    
    if(!validateEmail(email))
        return res.send({
            error: true,
            message: "E-mail passed not valid."
        })


    code_requested = code_requested.trim().toLowerCase()

    if(code_requested.length < 4 || code_requested.length > 15)
        return res.send({
            error: true,
            message: "Requested code should be 4-15 characters long."
        })
    
    if(about.length < 50 || about > 500)
        return res.send({
            error: true,
            message: "About information should be 50-500 characters long."
        })

    const code_already_used =  await Partnership.findOne({
        user_partnership_id: code_requested
    })

    if(code_already_used)
        return res.send({
            error: true,
            message: "Requested code is already being used. Reading: " + code_requested
        })

    await PartnershipRequest.create({
        user: req.session.user._id,
        about: about,
        code_requested: code_requested,
    })

    return res.send({error:false})
})

module.exports = router