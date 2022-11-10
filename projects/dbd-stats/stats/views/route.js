const express = require('express')
const router = express.Router()

const Views = require(__models + './DBDStats/Views/view')

router.post('/', async (req,res) => {
    const { country, user, page_url } = req.body
    if(!country || !page_url)return res.status(400).send({error:true,message:"Body doesn't match the requirements."})

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
