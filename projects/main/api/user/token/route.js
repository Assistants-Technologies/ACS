const express = require('express')
const router = express.Router()

const User = require('../../../../../models/user')
const { v4: uuidv4 } = require('uuid');

router.post('/regen', async (req,res) => {
    if(!req.session.user._id){
        return res.status(400).send({
            error: true,
            message: "Not authenticated"
        })
    }

    const newToken = uuidv4()

    await User.findOneAndUpdate({
        _id: req.session.user._id,
    },
    {
        account_access_token: newToken,
    })

    return res.status(200).send({
        error: false,
        token: newToken
    })
})

module.exports = router