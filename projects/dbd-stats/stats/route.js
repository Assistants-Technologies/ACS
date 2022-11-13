const express = require('express')
const router = express.Router()

router.get('/', async(req,res)=>{
    return res.send(req.dbd_project)
})

router.use('/views', require('./views/route'))
router.use('/auth-success', require('./auth-success/route'))

module.exports = router
