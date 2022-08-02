const express = require('express')
const router = express.Router()

router.use('/auth', require('./auth/route'))

router.use('/dbd-stats', require('./dbd-stats/route'))
router.use('/shop', require('./shop/route'))
router.use('/user', require('./user/route'))
router.use('/discord-dashboard', require('./discord-dashboard/route'))

module.exports = router