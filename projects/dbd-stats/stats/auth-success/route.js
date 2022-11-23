const express = require('express')
const router = express.Router()

const Auth = require(__models + './DBDStats/Auth/auth_success')

router.post('/', async (req,res) => {
    const { country, user } = req.body
    if(!country || !user)return res.status(400).send({error:true,message:"Body doesn't match the requirements."})

    await Auth.create({
        project_id: req.dbd_project._id,
        user_id: user,
        ip: req.ip,
        country,
    })

    return res.status(200).send({error:false})
})

module.exports = router
