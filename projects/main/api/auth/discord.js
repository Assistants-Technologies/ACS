require('dotenv').config({ path: './.env' });

const express = require('express')
const router = express.Router()

const CLIENT_ID = process.env.DISCORD_CLIENT_ID
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const CALLBACK_URL = process.env.DISCORD_CALLBACK_URL

const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: CALLBACK_URL,
    scope: ["identify", "guilds", "email", "connections", "guilds.join"],
});

const User = require('../../../../models/user')

router.get('/authorize', async(req,res)=>{
    if(req.session.user)
        return res.redirect('/?error=You are already logged in.')
    const url = oauth.generateAuthUrl({
        scope: ["identify", "guilds", "email", "connections", "guilds.join"],
    });
    req.session.oauth_discord = {
        mode: 'authorize',
    }
    await req.session.save()
    res.redirect(url)
})

router.get('/connect', async(req,res)=>{
    if(!req.session.user)
        return res.redirect('/?error=You are not already logged in.')
    const url = oauth.generateAuthUrl({
        scope: ["identify", "guilds", "email", "connections", "guilds.join"],
    });
    req.session.oauth_discord = {
        mode: 'connect',
    }
    await req.session.save()
    res.redirect(url)
})

router.get('/callback', async(req,res)=>{
    const back_redirect = req.session.back_redirect
    const { code } = req.query;
    const { mode  } = req.session.oauth_discord
    req.session.oauth_discord = null;
    if (!code || !mode) {
        return res.redirect('/?error=' + 'You denied the app or your session expired!');
    }
    const token = (await oauth.tokenRequest({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        scope: ["identify", "guilds", "email", "connections", "guilds.join"].join(' '),
        code,
        grantType: "authorization_code",

        redirectUri: CALLBACK_URL
    })).access_token
    const UserDiscordData = await oauth.getUser(token)
    const user = await User.findOne({'connections.discord.id': UserDiscordData.id})

    try{
        await oauth.addMember({
            accessToken: token,
            botToken: process.env.DISCORD_BOT_TOKEN,
            guildId: process.env.DISCORD_GUILD_ID,
            userId: UserDiscordData.id,
        })
    }catch(err){}

    if(mode == 'authorize'){
        if(user){
            req.session.user = {
                username: user.assistants_username,
                email: user.email,
                _id: user._id,
                admin: user.admin
            }
        }else{
            const NewUser = await User.create({
                assistants_username: '@d_' + UserDiscordData.username,
                connections: {
                    discord: {
                        id: UserDiscordData.id,
                    }
                }
            })
            req.session.user = {
                username: NewUser.assistants_username,
                email: NewUser.email,
                _id: NewUser._id,
                admin: NewUser.admin
            }
        }
    }else{
        if(user){
            if(user._id == req.session.user._id){
                return res.redirect('/profile?error=Requested Discord account is already connected with your ACS account.')
            }
            return res.redirect('/profile?error=Requested Discord account is already connected to another ACS account.')
        }else{
            const ThisUser = await User.findOne({
                _id: req.session.user?._id,
            })
            ThisUser.connections.discord = {
                id: UserDiscordData.id,
            }
            await ThisUser.save()
        }
    }

    return res.redirect(decodeURI(back_redirect))
})

module.exports = router