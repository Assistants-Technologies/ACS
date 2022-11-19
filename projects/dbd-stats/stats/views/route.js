const express = require('express')
const router = express.Router()

const ViewsCache = new (require('node-cache'))({ stdTTL: 60*15, checkperiod: 60*20 })

const Views = require(__models + './DBDStats/Views/view')

router.post('/', async (req,res) => {
    const { country, user, page_url } = req.body
    if(!country || !page_url)return res.status(400).send({error:true,message:"Body doesn't match the requirements."})

    if(user){
        if(ViewsCache.get(`${user};${page_url}`)){
            return res.status(400).send({
                error:true,
                message:`RL EXCEEDED FOR ${page_url} PAGE: MAX_VIEWS_PER_USER AS 1/15MIN`
            })
        }

        ViewsCache.set(`${user};${page_url}`, true)
    }else{
        const ip = req.ip
        if(ViewsCache.get(`${ip};${page_url}`)){
            return res.status(400).send({
                error:true,
                message:`RL EXCEEDED FOR ${page_url} PAGE: MAX_VIEWS_PER_IP (AS NO USER) AS 1/15MIN`
            })
        }

        ViewsCache.set(`${ip};${page_url}`, true)
    }

    await Views.create({
        project_id: req.dbd_project._id,
        website_url: page_url,
        user_id: user,
        ip: req.ip,
        country,
    })

    return res.status(200).send({error:false})
})

module.exports = router
