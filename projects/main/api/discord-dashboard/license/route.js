const { UserLicenseStatus } = require('../../../utils/DiscordDashboard')

const express = require('express')
const router = express.Router()

const { VerifyToken } = require('../../../utils/AccountAuthorization')

router.get('/status', async (req,res) => {
    const account_access_token = req.headers.authorization || ''
    const user = await VerifyToken(account_access_token)

    if(typeof(user) == 'string')
        return res.send({error:true,message:user})
    
    const license_status = await UserLicenseStatus(user._id)

    return res.send({error:false,license_status})
})

router.get('/status/session', async (req,res) => {
    if(!req.session.user)
        return res.send({
            error: true,
            message: "Not authorized"
        })
    const license_status = await UserLicenseStatus(req.session.user._id)

    return res.send({error:false,license_status})
})

module.exports = router