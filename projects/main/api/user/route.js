const express = require('express')
const router = express.Router()

router.use('/token', require('./token/route'))
router.use('/password', require('./password/route'))
router.use('/avatar', require('./avatar/route'))
router.use('/coins', require('./coins/route'))

module.exports = router