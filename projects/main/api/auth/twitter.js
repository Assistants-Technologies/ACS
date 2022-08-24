require('dotenv').config({ path: './.env' });

const express = require('express')
const router = express.Router()

const CryptoJS = require("crypto-js")

const { TwitterApi } = require('twitter-api-v2')

const User = require('../../../../models/user')

const TwitterTokens = require('../../../../models/twitterTokens')

const TWITTER_APP_KEY = process.env.TWITTER_APP_KEY
const TWITTER_APP_SECRET = process.env.TWITTER_APP_SECRET
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET
const CALLBACK_URL = process.env.TWITTER_CALLBACK_URL

const client = new TwitterApi({ clientId: TWITTER_CLIENT_ID, clientSecret: TWITTER_CLIENT_SECRET, });

router.get('/authorize', async(req,res)=>{
    if(req.session.user)
        return res.redirect('/?error=You are already logged in.')
    const { url, codeVerifier, state } = await client.generateOAuth2AuthLink(CALLBACK_URL, { scope: ['tweet.read', 'users.read', 'tweet.write', 'offline.access'] });
    req.session.oauth_twitter = {
        mode: 'authorize',
        url,
        codeVerifier,
        state,
    }
    await req.session.save()
    res.redirect(url)
})

router.get('/connect', async(req,res)=>{
    if(!req.session.user)
        return res.redirect('/?error=You are not logged in.')
    const { url, codeVerifier, state } = await client.generateOAuth2AuthLink(CALLBACK_URL, { scope: ['tweet.read', 'users.read', 'tweet.write', 'offline.access'] });
    req.session.oauth_twitter = {
            mode: 'connect',
            url,
            codeVerifier,
            state,
        }
    await req.session.save()
    res.redirect(url)
})

router.get('/callback', (req, res) => {
    const back_redirect = req.session.back_redirect
    const { state, code } = req.query
    const { url, codeVerifier, state: sessionState,  mode } = req.session.oauth_twitter
    req.session.oauth_twitter = null

    if (!codeVerifier || !state || !sessionState || !code) {
        return res.status(400).send('You denied the app or your session expired!');
    }
    if (state !== sessionState) {
        return res.status(400).send('Stored tokens didnt match!');
    }

    client.loginWithOAuth2({ code, codeVerifier, redirectUri: CALLBACK_URL })
        .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {
            const userData = (await loggedClient.v2.me()).data
            const { id } = userData

            const user = await User.findOne({ 'connections.twitter.id': id })

            if(mode === 'authorize'){
                if(user){
                    req.session.user = {
                        _id: user._id,
                        username: user.assistants_username,
                        email: user.email,
                        admin: user.admin
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
                        admin: NewUser.admin
                    }
                }
            }else{
                if(user){
                    if(user._id == req.session.user._id){
                        return res.redirect('/profile?error=Requested Twitter account is already connected with your ACS account.')
                    }
                    return res.redirect('/profile?error=Requested Twitter account is already connected to another ACS account.')
                }else{
                    const ThisUser = await User.findOne({
                        _id: req.session.user._id
                    })
                    ThisUser.connections.twitter = {
                        id,
                    }
                    await ThisUser.save()
                }
            }

            const twitterTokensFound = await TwitterTokens.findOne({ user: req.session.user._id })
            if(twitterTokensFound){
                twitterTokensFound.acceess_token = CryptoJS.AES.encrypt(accessToken, process.env.TWITTER_ENCODE_KEY).toString()
                twitterTokensFound.refresh_token = CryptoJS.AES.encrypt(refreshToken, process.env.TWITTER_ENCODE_KEY).toString()
                await twitterTokensFound.save()
            }else{
                await TwitterTokens.create({
                    user: req.session.user._id,
                    acceess_token: CryptoJS.AES.encrypt(accessToken, process.env.TWITTER_ENCODE_KEY).toString(),
                    refresh_token: CryptoJS.AES.encrypt(refreshToken, process.env.TWITTER_ENCODE_KEY).toString()
                })
            }
            return res.redirect(back_redirect)
        })
        .catch((e) => {
            res.status(403).send('Invalid verifier or access tokens!')
        });
});

module.exports = router