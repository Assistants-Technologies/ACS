const express = require('express')
const router = express.Router()

router.use('/webhook', require('./webhook/route'))

module.exports = router