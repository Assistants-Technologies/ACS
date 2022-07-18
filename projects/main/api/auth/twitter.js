require('dotenv').config({ path: './.env' });

const express = require('express')
const router = express.Router()

const { TwitterApi } = require('twitter-api-v2')

const User = require('../../../../models/user')

const TWITTER_APP_KEY = process.env.TWITTER_APP_KEY
const TWITTER_APP_SECRET = process.env.TWITTER_APP_SECRET
const CALLBACK_URL = process.env.TWITTER_CALLBACK_URL

const client = new TwitterApi({ appKey: TWITTER_APP_KEY, appSecret: TWITTER_APP_SECRET });

router.get('/authorize', async(req,res)=>{
    if(req.session.user)
        return res.redirect('/?error=You are already logged in.')
    const {oauth_token, oauth_token_secret, url} = await client.generateAuthLink(CALLBACK_URL, { linkMode: 'authorize' });
    req.session.oauth_twitter = {
        mode: 'authorize',
        oauth_token,
        oauth_token_secret,
        back_redirect: req.query?.back_redirect || '/',
    }
    await req.session.save()
    res.redirect(url)
})

router.get('/connect', async(req,res)=>{
    if(!req.session.user)
        return res.redirect('/?error=You are not logged in.')
    const {oauth_token, oauth_token_secret, url} = await client.generateAuthLink(CALLBACK_URL, { linkMode: 'authorize' });
    req.session.oauth_twitter = {
        mode: 'connect',
        oauth_token,
        oauth_token_secret,
        back_redirect: req.query?.back_redirect || '/',
    }
    await req.session.save()
    res.redirect(url)
})

router.get('/callback', (req, res) => {
    const { oauth_token, oauth_verifier } = req.query;
    const { oauth_token_secret, mode, back_redirect } = req.session.oauth_twitter;
    req.session.oauth_twitter = null;

    if (!oauth_token || !oauth_verifier || !oauth_token_secret || !mode) {
        return res.redirect('/?error=' + 'You denied the app or your session expired!');
    }
    const client = new TwitterApi({
        appKey: TWITTER_APP_KEY,
        appSecret: TWITTER_APP_SECRET,
        accessToken: oauth_token,
        accessSecret: oauth_token_secret,
    });

    client.login(oauth_verifier)
        .then(async ({ client: loggedClient, accessToken, accessSecret }) => {
            const userData = (await loggedClient.v2.me()).data
            const { id } = userData;

            const user = await User.findOne({ 'connections.twitter.id': id })

            if(mode === 'authorize'){
                if(user){
                    req.session.user = {
                        _id: user._id,
                        username: user.assistants_username,
                        email: user.email,
                    }
                    req.session.save()
                }else{
                    const NewUser = await User.create({
                        assistants_username: '@t_' + userData.username,
                        connections: {
                            twitter: {
                                id,
                            }
                        }
                    })
                    req.session.user = {
                        username: NewUser.assistants_username,
                        email: null,
                        _id: NewUser._id,
                    }
                }
            }else{
                if(user){
                    if(user._id == req.session.user._id){
                        return res.redirect('/profile')
                    }
                    return res.redirect('/profile' + '?error=' + 'This account is already connected to another user.')
                }else{
                    const ThisUser = await User.findOne({
                        _id: req.session.user._id
                    })
                    if(ThisUser.connections?.twitter?.id){
                        return res.redirect('/profile' + '?error=' + 'You already have a Twitter account connected to your account.')
                    }
                    ThisUser.connections.twitter = {
                        id,
                    }
                    await ThisUser.save()
                }
            }

            return res.redirect(back_redirect)
        })
        .catch(() => res.status(403).send('Invalid verifier or access tokens!'));
});

module.exports = router