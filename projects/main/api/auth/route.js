const express = require('express')
const router = express.Router()

const OIDC = require('openid-client')
const { Issuer } = OIDC

let ACS_Client;
Issuer.discover(process.env.ACS_PROVIDER).then(acs_issuer => {
    ACS_Client = new acs_issuer.Client({
        client_id: process.env.ACS_CLIENT_ID,
        client_secret: process.env.ACS_CLIENT_SECRET,
        redirect_uris: [process.env.ACS_REDIRECT_URI],
        response_types: ['code']
    })
})

const User = require('../../../../models/user')

router.get('/', (req, res) => {
    const back_redirect = req.query.back_redirect || req.query.redirect_back || '/dashboard'
    req.session.back_redirect = back_redirect
    const url = ACS_Client.authorizationUrl({
        scope: 'openid profile email',
    })
    res.redirect(url)
})

router.get('/session/destroy', (req,res) => {
    res.redirect(`${process.env.ACS_PROVIDER.replace('/oidc','')}/logout?back_redirect=${process.env.DOMAIN_URL}`)
})

router.get('/callback', async (req, res) => {
    try {
        const params = ACS_Client.callbackParams(req);
        const tokenSet = await ACS_Client.callback(process.env.ACS_REDIRECT_URI, params)

        const user_info = await ACS_Client.userinfo(tokenSet.access_token)

        const user = await User.findOne({
            _id: user_info.sub.replace("acc_", "")
        })

        req.session.user = {
            _id: user._id,
            username: user.assistants_username,
            email: user.email,
            avatarURL: user.avatarURL,
            admin: user.admin
        }
        await req.session.save()

        res.redirect(req.session.back_redirect || '/dashboard')
    }catch(err){
        return res.redirect(`/?error=${err.message}`)
    }
})

router.use('/discord', require('./discord'))
router.use('/twitter', require('./twitter'))

module.exports = router