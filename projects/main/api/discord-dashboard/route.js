const express = require('express')
const router = express.Router()

router.use('/project', require('./project/route'))
router.use('/license', require('./license/route'))

const User = require('../../../../models/user')
const DiscordDashboard = require('../../../../models/discordDashboard')

const { VerifyToken } = require('../../utils/AccountAuthorization')

router.get('/me', async (req,res)=>{
    const account_access_token = req.headers.authorization || ''
    const user = await VerifyToken(account_access_token)

    if(typeof(user) == 'string')
        return res.send({error:true,message:user})

    res.send({error:false,you_are:{id: user._id, username: user.assistants_username}})
})

module.exports = router