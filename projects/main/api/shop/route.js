const express = require('express')
const router = express.Router()

router.use('/payment', require('./payment/route'))
router.use('/subscription', require('./subscription/route'))
router.use('/coins', require('./coins/route'))
router.use('/items', require('./items/route'))
router.use('/digital-items', require('./digital_items/route'))

module.exports = router