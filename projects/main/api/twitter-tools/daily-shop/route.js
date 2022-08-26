const express = require('express')
const router = express.Router()

const DailyShop = require('../../../../../models/TwitterTools/dailyShop')

const { generateShop, getShopItems } = require("../../../../../twitterTools/FortShop/shop")

router.route('/image')
    .get(async(req,res)=>{
        const { lang="pl" } = req.query
        const items = await getShopItems(process.env.FNAPIIO_APIKEY, lang)
        const shopBuff = await generateShop(items)

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': shopBuff.length
        })
        res.end(shopBuff)
    })

router.route('/')
    .get(async(req,res)=>{
        if(!req.session?.user)
            return res.send({
                error: true,
                message: "Not authorized"
            })

        const user_dailyshop = await DailyShop.findOne({
            user: req.session.user._id,
        })

        return res.send({
            error: false,
            data: user_dailyshop || {}
        })
    })
    .post(async(req,res)=>{
        if(!req.session?.user)
            return res.send({
                error: true,
                message: "Not authorized"
            })

        const { enabled=true, sac='ASSISTANTS', messageContent='', lang='en' } = req.body

        if(messageContent.length > 280)
            return res.send({
                error: true,
                message: "Message content should me max 280 chars long."
            })

        if(sac.length > 30)
            return res.send({
                error: true,
                message: "SAC code should me max 30 chars long."
            })

        if(
            lang != "en"
            &&
            lang != "pl"
            &&
            lang != "de"
            &&
            lang != "fr"
            &&
            lang != "es"
        )
            return res.send({
                error: true,
                message: `Requested language (${lang}) is not supported.`
            })

        let user_dailyshop = await DailyShop.findOne({
            user: req.session.user._id,
        })
        if(!user_dailyshop)user_dailyshop = await DailyShop.create({
            user: req.session.user._id,
        })

        user_dailyshop.enabled = enabled
        user_dailyshop.sac = sac
        user_dailyshop.message_content = messageContent
        user_dailyshop.lang = lang

        await user_dailyshop.save()

        return res.send({
            error: false,
        })
    })

module.exports = router