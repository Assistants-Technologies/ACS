const express = require('express')
const router = express.Router()

router.use('/project', require('./project/route'))

module.exports = router