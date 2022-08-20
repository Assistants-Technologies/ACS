const express = require('express')
const router = express.Router()

router.use('/project', require('./project/route'))
router.use('/plan', require('./plan/route'))

module.exports = router