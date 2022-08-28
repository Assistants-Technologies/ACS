const express = require('express')
const path = require("path")
const session = require('express-session')
const MongoStore = require('connect-mongo');
const APIRoute = require('./api/route')

const rateLimit = require('express-rate-limit')
const rateMongoStore = require('rate-limit-mongo')

const Project = require('../../models/DBDStats/dbd_project')
const Views = require('../../models/DBDStats/Views/view')

const User = require('../../models/user')

const vhost = ({next_app, next_handle, client}) => {
    const app = express()

    app.use((req,res,next)=>{
        req.next_app = next_app
        req.client = client
        next()
    })

    app.set('trust proxy', 1)
    app.use(session({
        secret: process.env.COOKIES_SECRET,
        resave: false,
        saveUninitialized: true,
        maxAge: new Date(Date.now() + 3600000*24*7), //1*24*7 Hour = 1 Week
        expires: new Date(Date.now() + 3600000*24*7), //1*24*7 Hour = 1 Week
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL
        }),
    }))

    app.use('/api/stripe/webhook', express.raw({type: "*/*"}))
    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))

    const globalLimiter = rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 1500,
        standardHeaders: true,
        legacyHeaders: false,
        store: new rateMongoStore({
            uri: process.env.MONGO_URL,
            expireTimeMs: 10 * 60 * 1000,
            collectionName: 'RateLimitGLOBAL',
        }),
        message: () => {return {error: true, message: "You are ratelimited. Only 1500 requests per 10 minutes are allowed to /"}},
    })

    app.use('*', globalLimiter)

    const apiLimiter = rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 500,
        standardHeaders: true,
        legacyHeaders: false,
        store: new rateMongoStore({
            uri: process.env.MONGO_URL,
            expireTimeMs: 5 * 60 * 1000,
            collectionName: 'RateLimitAPI',
        }),
        message: () => {return {error: true, message: "You are ratelimited. Only 500 requests per 5 minutes are allowed to /api/"}},
    })

    const apiAuthLimiter = rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 30,
        standardHeaders: true,
        legacyHeaders: false,
        store: new rateMongoStore({
            uri: process.env.MONGO_URL,
            expireTimeMs: 10 * 60 * 1000,
            collectionName: 'RateLimitAUTH',
        }),
        message: () => {return {error: true, message: "You are ratelimited. Only 30 requests per 10 minutes are allowed to /api/auth/"}},
    })

    app.use('/api/auth/', apiAuthLimiter)

    app.use('/api', apiLimiter, APIRoute)

    app.use((req,res,next)=>{
        const {referral_code} = req.query
        if(referral_code)req.session.referral_code = referral_code

        next()
    })

    app.use('/admin', require('./admin'))

    app.get('/', (req,res)=>{
        return res.redirect('/dashboard')
        /*return next_app.render(req, res, '/index', {
            url: req.url,
            user: req.session.user,
        })*/
    })

    app.get('/twitter-tools/daily-shop', (req,res)=>{
        if(!req.session.user)
            return res.redirect('/auth?back_redirect=/twitter-tools/daily-shop')

        return next_app.render(req, res, '/twitter-tools/daily-shop', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/privacy-policy', (req,res)=>{
        return next_app.render(req, res, '/legal/pp', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/pp', (req,res)=>{
        return res.redirect('/privacy-policy')
    })

    app.get('/terms-of-services', (req,res)=>{
        return next_app.render(req, res, '/legal/tos', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/tos', (req,res)=>{
        return res.redirect('/terms-of-services')
    })

    app.get('/terms-of-purchase', (req,res)=>{
        return next_app.render(req, res, '/legal/top', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/top', (req,res)=>{
        return res.redirect('/terms-of-purchase')
    })

    app.get('/licenses', (req,res)=>{
        res.redirect('/discord-dashboard/v2')
    })

    app.get('/licenses/:t', (req,res)=>{
        res.redirect('/discord-dashboard/v2')
    })

    app.get('/auth', (req,res) => {
        const {back_redirect, redirect_back} = req.query
        if(back_redirect || redirect_back){
            req.session.back_redirect = back_redirect || redirect_back
        }
        const back_redirect_n = req.session.back_redirect

        if(req.session?.user)return res.status(401).redirect(back_redirect_n)
        return next_app.render(req, res, '/auth', {
            url: req.url,
            back_redirect: back_redirect_n
        })
    })

    app.get('/blog/create', (req, res) => {
        if(req.session?.user?.admin !== true)return res.status(401).redirect('/')

        return next_app.render(req, res, '/create-blog-post', {
            url: req.url,
            user: req.session.user || {}
        })
    })

    app.get('/shop', (req,res)=>{
        if(!req.session.user) {
            return res.redirect('/auth?back_redirect=/shop')
        }

        return next_app.render(req, res, '/shop', {
            url: req.url,
            user: req.session.user,
            preloadedReferralCode: req.session?.referral_code || null
        })
    })

    app.get('/profile', async (req,res)=>{
        if(!req.session.user) {
            return res.redirect('/auth?back_redirect=/profile')
        }

        const user = await User.findOne({
            _id: req.session.user._id,
        })
        let connections = {}

        connections.Discord = user?.connections?.discord?.id || null
        connections.Twitter = user?.connections?.twitter?.id || null

        return next_app.render(req, res, '/profile', {
            url: req.url,
            user: req.session.user,
            connections,
            query: req.query || {},
            email: user.email
        })
    })

    app.get('/dashboard', (req,res)=>{
        if(!req.session.user)
            return res.redirect('/auth')

        return next_app.render(req, res, '/dashboard', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/discord-dashboard', (req, res) => {
        if(!req.session.user)
            return res.redirect('/auth?back_redirect=/discord-dashboard')
        
        if(!req.session.user.admin)
            return res.status(403).redirect('/discord-dashboard/v2')

        return next_app.render(req, res, '/discord-dashboard', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/discord-dashboard/v2', async (req, res) => {
        if(!req.session.user)
            return res.redirect('/auth?back_redirect=/discord-dashboard')

        const user = await User.findOne({
            _id: req.session.user._id,
        })
        const licenses = {
            OpenSource: user?.OpenSource?.license_id || null,
            Personal: user?.Personal?.license_id || null,
            Production: user?.Production?.license_id || null,
        }
        return next_app.render(req, res, '/discord-dashboard-v2', {
            url: req.url,
            user: req.session.user,
            licenses,
        })
    })

    app.get('/discord-dashboard/project/:projectId', async (req,res)=>{
        if(!req.session.user)
        return res.redirect('/auth?back_redirect=/discord-dashboard')
    
        if(!req.session.user.admin)
            return res.status(403).redirect('/discord-dashboard/v2')

        const projectId = req.params.projectId
        if(!req.session.user)
            return res.redirect('/auth?back_redirect=/discord-dashboard/project/'+projectId)

        const ProjectData = await Project.findOne({
            url: req.url,
            _id: projectId,
        })

        if(!ProjectData)
            return res.redirect('/discord-dashboard?error=Project not found')

        if(ProjectData.owner != req.session.user._id)
            return res.redirect('/auth?back_redirect=/discord-dashboard/project/'+projectId+`&error=You are not authorized to access this project. Please use proper account.`)

        return next_app.render(req, res, '/discord-dashboard-project', {
            url: req.url,
            user: req.session.user,
            project: {
                _id: ProjectData._id.toString(),
                name: ProjectData.name,
                theme: ProjectData.theme,
                createdAt: new Date(ProjectData.createdAt).toLocaleDateString(),
                updatedAt: new Date(ProjectData.updatedAt).toLocaleDateString(),
            },
        })
    })

    app.get('/partnership', async (req, res) => {
        if(!req.session.user)
            return res.redirect('/auth?back_redirect=/partnership')
            return next_app.render(req, res, '/partnership', {
                url: req.url,
                user: req.session.user,
            })
    })

    app.use(express.static(path.join(__dirname, './public'), ))

    /*
     *  AOS assets v2 (old) support
     */
    app.use(express.static(path.join(__dirname, './assets-v2'), { redirect : false }))


    app.all('*', (req,res)=>next_handle(req,res))

    return app
}

module.exports = {
    vhost,
    prodPort:process.env.PROD_BUT_BETA === "TRUE" ? 2000 : 3000
}
