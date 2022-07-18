const express = require('express')
const router = express.Router()

const itemsList = require('../../../../../configs/itemsList.json')

router.get('/get', async (req, res) => {
if(!req.session?.user){
        return res.status(400).json({
            error:true,
            message: "Not authenticated"
        })
    }

    return res.status(200).json({
        error: false,
        items: itemsList
    })
})

module.exports = router