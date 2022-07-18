const express = require('express')
const router = express.Router()

router.use('/token', require('./token/route'))
router.use('/password', require('./password/route'))
router.use('/avatar', require('./avatar/route'))

module.exports = router