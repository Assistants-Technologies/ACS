const express = require('express')
const path = require("path")
const session = require('express-session')
const MongoStore = require('connect-mongo');
const APIRoute = require('./api/route')

const Project = require('../../models/DBDStats/dbd_project')
const Views = require('../../models/DBDStats/Views/view')

const vhost = ({next_app, next_handle}) => {
    const app = express()

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

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))

    app.get('/session', (req,res)=>res.send(req.session))

    app.use('/api', APIRoute)

    app.get('/', (req,res)=>{
        return next_app.render(req, res, '/index', {
            url: req.url,
        })
    })

    app.get('/auth', (req,res) => {
        return next_app.render(req, res, '/auth', {
            url: req.url,
        })
    })

    app.get('/shop', (req,res)=>{
        if(!req.session.user) {
            return res.redirect('/auth?back_redirect=/shop')
        }

        return next_app.render(req, res, '/shop', {
            url: req.url,
            user: req.session.user
        })
    })

    app.get('/profile', (req,res)=>{
        if(!req.session.user) {
            return res.redirect('/auth?back_redirect=/profile')
        }

        return next_app.render(req, res, '/profile', {
            url: req.url,
            user: req.session.user
        })
    })

    app.get('/dashboard', (req,res)=>{
        if(!req.session.user)
            return res.redirect('/auth?back_redirect=/dashboard');

        return next_app.render(req, res, '/dashboard', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/discord-dashboard', (req, res) => {
        if(!req.session.user)
            return res.redirect('/auth?back_redirect=/discord-dashboard');
        return next_app.render(req, res, '/discord-dashboard', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/discord-dashboard/project/:projectId', async (req,res)=>{
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

    app.use(express.static(path.join(__dirname, '../../public')))

    app.use('/cdn', express.static(path.join(__dirname, '../../cdn'), { redirect : false }))

    app.all('*', (req,res)=>next_handle(req,res))

    return app
}

module.exports = {
    vhost,
    prodPort: 3000
}
