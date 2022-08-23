const express = require('express')
const router = express.Router()

const Project = require('../../../../../models/DBDStats/dbd_project')
const Views = require('../../../../../models/DBDStats/Views/view')

router.route('/addons')
    .get((req,res)=>{
        res.send("ok")
    })
module.exports = router