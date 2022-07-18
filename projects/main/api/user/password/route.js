const express = require('express')
const ObjectId = require('mongoose').Types.ObjectId;
const router = express.Router()

router.post('/change-request/:user_id', async (req,res) => {
    const user_id = req.params.user_id;

    if(!ObjectId.isValid(user_id)) {
        return res.status(400).json({
            error: true,
            message: 'Invalid ObjectId',
        })
    }

    return res.send({
        error: false,
    })
})

module.exports = router