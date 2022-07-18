const express = require('express')
const router = express.Router()

const User = require('../../../../../models/user')

router.get('/get', async (req, res) => {
    if(!req.session?.user){
        return res.status(400).json({
            error:true,
            message: "Not authenticated"
        })
    }

    const user = await User.findOne({
        _id: req.session.user._id,
    })

    return res.status(200).send({
        error: false,
        coins: user.coins,
    })
})

module.exports = router