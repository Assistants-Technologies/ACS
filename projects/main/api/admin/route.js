const express = require('express')
const router = express.Router()

const User = require('../../../../models/user')

router.use('/support/questions', require('./questions/route'))

router.route('/users/list')
    .get(async(req,res) => {
        if(req.session?.user?.admin !== true)
            return res.status(403).send()
        const users = await User.find({}).lean()

        for(let i in users){
            delete users[i].account_access_token
            delete users[i].password
        }

        return res.send({error:false,users})
    })

module.exports = router