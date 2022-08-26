const express = require('express')
const router = express.Router()

router.use('/daily-shop', require('./daily-shop/route'))

module.exports = router