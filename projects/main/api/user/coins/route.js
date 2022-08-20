const express = require('express')
const router = express.Router()

const User = require('../../../../../models/user')
const { v4: uuidv4 } = require('uuid');

router.route('/:user_id')
    .get(async (req,res)=>{
    })

module.exports = router