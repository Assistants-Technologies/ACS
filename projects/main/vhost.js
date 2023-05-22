const express = require('express')
const path = require("path")
const session = require('express-session')
const MongoStore = require('connect-mongo');
const APIRoute = require('./api/route')

const BlogPost = require(__models + '/Blog/posts')
const BlogCategories = require(__models + '/Blog/categories')

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

const rateLimit = require('express-rate-limit')
const rateMongoStore = require('rate-limit-mongo')

const Project = require('../../models/DBDStats/dbd_project')
const Views = require('../../models/DBDStats/Views/view')

const User = require('../../models/user')

const vhost = ({ next_app, next_handle, client }) => {
    const app = express()

    app.use((req, res, next) => {
        req.next_app = next_app
        req.client = client
        next()
    })

    app.set('trust proxy', 1)
    app.use(session({
        secret: process.env.COOKIES_SECRET,
        resave: false,
        saveUninitialized: true,
        maxAge: new Date(Date.now() + 3600000 * 24 * 7), //1*24*7 Hour = 1 Week
        expires: new Date(Date.now() + 3600000 * 24 * 7), //1*24*7 Hour = 1 Week
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL
        }),
    }))

    app.use('/api/stripe/webhook', express.raw({ type: "*/*" }))
    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))

    const globalLimiter = rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 3500,
        standardHeaders: true,
        legacyHeaders: false,
        store: new rateMongoStore({
            uri: process.env.MONGO_URL,
            expireTimeMs: 10 * 60 * 1000,
            collectionName: 'RateLimitGLOBAL',
        }),
        message: () => { return { error: true, message: "You are ratelimited. Only 3500 requests per 10 minutes are allowed to /*" } },
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
        message: () => { return { error: true, message: "You are ratelimited. Only 500 requests per 5 minutes are allowed to /api/" } },
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
        message: () => { return { error: true, message: "You are ratelimited. Only 30 requests per 10 minutes are allowed to /api/auth/" } },
    })

    app.use('/api/auth/', apiAuthLimiter)

    app.use('/api', apiLimiter, APIRoute)

    app.use((req, res, next) => {
        const { referral_code } = req.query
        if (referral_code) req.session.referral_code = referral_code

        if (req.session.user) User.findOne({ _id: req.session.user._id }, (err, user) => {
            if (err) return;
            if (!user) return;
            var ip = req.headers['cf-connecting-ip'];

            updateKnownAccounts(ip, user);

            if (user.warnings?.find(w => w.active === true) || user.suspended?.enabled) {
                req.session.user = user
                try {
                    if (!req.uri.startsWith("/auth/warning")) return res.redirect('/auth/warning');
                    else if (!req.uri.startsWith("/auth/suspended")) return res.redirect('/auth/suspended');
                } catch (error) { }
            }
        });
        
        if ([
            '/auth',
            '/blog',
            '/api/auth',
            '/api/admin',
            '/css',
            '/js',
            '/images',
            '/mycss',
            '/landing',
            '/_next',
            '/tos',
            '/pp'
        ].some(path => req.url.startsWith(path)) || req.url === "/" || req.url.startsWith("/?")) {
            if(req.session.user && req.session?.user?.warnings?.find(w => w.active === true) && req.url.toLowerCase().includes("?redirect_back")) return res.redirect(req.url.split("?redirect_back=")[1] + "?redirect_back=/auth/warning");
            if(req.session.user && req.session?.user?.suspended?.enabled && req.url.toLowerCase().includes("?redirect_back")) return res.redirect(req.url.split("?redirect_back=")[1] + "?redirect_back=/auth/suspended");
            
            
            return next();
        }

        try {
            if (req.session.user && req.session?.user?.warnings?.find(w => w.active === true)) return res.redirect('/auth/warning'); // Function above will redirect to /auth/warning
            else if (req.session.user && req.session?.user?.suspended?.enabled) return res.redirect('/auth/suspended'); // Function above will redirect to /auth/warning
            else next()
        } catch (e) { }
    })

    app.use('/admin', require('./admin'))

    app.get('/', (req, res) => {
        return next_app.render(req, res, '/landing', {
            url: req.url,
            user: req.session.user,
        })
    })


    app.get('/auth/warning', async(req, res) => {
        if(!req.session.user) return res.redirect('/auth');
        // update user in session
        const user = await User.findOne({ _id: req.session.user._id })
        req.session.user = user;
        if(!user.warnings?.find(w => w.active === true)) return res.redirect('/dashboard');

        req.next_app.render(req, res, '/warning', {
            url: req.url,
            userID: req.session.user._id.toString(),
            warning: JSON.stringify(user?.warnings?.find(w => w.active === true))
        })
    })

    app.get('/auth/suspended', async(req, res) => {
        if(!req.session.user) return res.redirect('/auth');
        // update user in session
        const user = await User.findOne({ _id: req.session.user._id })
        req.session.user = user;
        if(!user.suspended?.enabled) return res.redirect('/dashboard');

        if(user.suspended?.until && user.suspended?.until < Date.now()) {
            if (user.suspended.ip) {
                User.find({ ip_address: user.ip_address }).forEach(async u => {
                    u.suspended.enabled = false;
                    u.suspended.reason = null;
                    u.suspended.until = null;
                    u.suspended.admin = null;
                    u.suspended.ip = null;
        
                    await u.save();
                });
        
                user.known_accounts.forEach(async a => {
                    User.find({ _id: a }).forEach(async u => {
                        if(!u.suspended?.enabled) return;
                        u.suspended.enabled = false;
                        u.suspended.reason = null;
                        u.suspended.until = null;
                        u.suspended.admin = null;
                        u.suspended.ip = null;
        
                        await u.save();
                    });
                });
            } else {
                user.suspended.enabled = false;
                user.suspended.reason = null;
                user.suspended.until = null;
                user.suspended.admin = null;
                user.suspended.ip = null;
        
                await user.save();
            }

            req.session.user = user;
            return res.redirect('/dashboard');
        }

        req.next_app.render(req, res, '/suspended', {
            url: req.url,
            userID: req.session.user._id.toString(),
            suspended: JSON.stringify(user?.suspended)
        })
    })

    

    app.get('/twitter-tools/daily-shop', (req, res) => {
        if (!req.session.user)
            return res.redirect('/auth?back_redirect=/twitter-tools/daily-shop')

        return next_app.render(req, res, '/twitter-tools/daily-shop', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/privacy-policy', (req, res) => {
        return next_app.render(req, res, '/legal/pp', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/pp', (req, res) => {
        return res.redirect('/privacy-policy')
    })

    app.get('/terms-of-services', (req, res) => {
        return next_app.render(req, res, '/legal/tos', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/tos', (req, res) => {
        return res.redirect('/terms-of-services')
    })

    app.get('/terms-of-purchase', (req, res) => {
        return next_app.render(req, res, '/legal/top', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/top', (req, res) => {
        return res.redirect('/terms-of-purchase')
    })

    app.get('/licenses', (req, res) => {
        res.redirect('/discord-dashboard/v2')
    })

    app.get('/licenses/:t', (req, res) => {
        res.redirect('/discord-dashboard/v2')
    })

    const DEVELOPMENT_CHANNEL = process.env.DEVELOPMENT_CHANNEL === "TRUE"
    const PROD_BUT_BETA = process.env.PROD_BUT_BETA === "TRUE"

    app.get('/auth', async (req, res) => {
        if (DEVELOPMENT_CHANNEL && !PROD_BUT_BETA) {
            const user = await User.findOne({
                _id: process.env.LOCALHOST_DEFAULT_USER,
            });

            if (!user) return res.redirect('/?error=LocalUserNotFound');

            req.session.user = {
                _id: user._id,
                username: user.assistants_username,
                email: user.email,
                avatarURL: user.avatarURL,
                admin: user.admin,
                blog_permissions: user.blog_permissions,
            }

            return res.redirect('/dashboard?e=1')
        }

        const back_redirect = req.query.back_redirect || req.query.redirect_back || '/dashboard'
        req.session.back_redirect = back_redirect
        const url = ACS_Client.authorizationUrl({
            scope: 'openid profile email',
        })
        res.redirect(url.replace("localhost:3006", "v2identity.assistantscenter.com"))
    })

    app.get('/blog/create', (req, res) => {
        if (req.session?.user?.blog_permissions !== true) return res.status(401).redirect('/')

        return next_app.render(req, res, '/create-blog-post', {
            url: req.url,
            user: req.session.user || {}
        })
    })

    app.get('/blog/edit/:postId', async (req, res) => {
        if (req.session?.user?.blog_permissions !== true) return res.status(401).redirect('/')

        const postData = await BlogPost.findOne({
            _id: req.params.postId,
        }).populate('category').exec()

        if (!postData) return res.status(404).redirect('/')

        return next_app.render(req, res, '/create-blog-post', {
            url: req.url,
            user: req.session.user || {},
            post_data: JSON.parse(JSON.stringify(postData)),
        })
    })

    app.get('/blog', async (req, res) => {
        const page = req.query.page || 1
        const limit = 10

        let posts = (await BlogPost.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('category').exec())
        posts = JSON.parse(JSON.stringify(posts)).map(post => {
            delete post.content
            return post
        })

        const postsCount = await BlogPost.countDocuments({})

        return next_app.render(req, res, '/blog', {
            url: req.url,
            user: req.session.user || {},
            posts: JSON.parse(JSON.stringify(posts)),
            postsCount,
            page,
            limit,
        })
    })

    app.post('/api/blog/update/:postId', async (req, res) => {
        if (req.session?.user?.admin !== true) return res.status(401).redirect('/')

        const postData = await BlogPost.findOne({
            _id: req.params.postId,
        }).populate('category').exec()

        if (!postData) return res.status(404).redirect('/')

        const { title, slug, category, content, image } = req.body

        if (category) {
            let catTag = await BlogCategories.findOne({
                slug: category,
            })

            if (!catTag) {
                catTag = await BlogCategories.create({
                    name: category,
                    slug: category,
                })
            }

            postData.category = catTag._id
        }

        if (title) postData.title = title
        if (slug) postData.slug = slug
        if (content) postData.content = content
        if (image) postData.image = image

        await postData.save()

        return res.send({ error: false, message: "Post updated successfully", post_id: postData._id })
    })

    app.post('/api/blog/create', async (req, res) => {
        if (req.session?.user?.blog_permissions !== true) return res.status(401).redirect('/')

        const { title, slug, category, content, image } = req.body

        let catTag = await BlogCategories.findOne({
            slug: category,
        })

        if (!catTag) {
            catTag = await BlogCategories.create({
                name: category,
                slug: category,
            })
        }

        if (!title || !content || !slug) return res.status(400).redirect('/blog/create')

        const newPost = await BlogPost.create({
            category: catTag._id,
            title,
            content,
            slug,
            image,
        })

        return res.send({ error: false, message: "Post created successfully", post_id: newPost._id })
    })

    app.get('/blog/:category/:slug', async (req, res) => {
        const catTag = await BlogCategories.findOne({
            slug: req.params.category,
        })

        if (!catTag) return res.status(404).redirect('/blog?error=404,category_not_found')

        const postData = await BlogPost.findOne({
            slug: req.params.slug,
            category: catTag._id,
        }).populate('category').exec()

        if (!postData) return res.redirect('/blog?e=404,post_not_found')

        return next_app.render(req, res, '/blog-post', {
            url: req.url,
            user: req.session.user || {},
            post_data: JSON.parse(JSON.stringify(postData)),
        })
    });

    app.get('/shop', (req, res) => {
        if (!req.session.user) {
            return res.redirect('/auth?back_redirect=/shop')
        }

        return next_app.render(req, res, '/shop', {
            url: req.url,
            user: req.session.user,
            preloadedReferralCode: req.session?.referral_code || null
        })
    })

    app.get('/profile', async (req, res) => {
        if (!req.session.user) {
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

    app.get('/dashboard', (req, res) => {
        if (!req.session.user)
            return res.redirect('/auth')

        return next_app.render(req, res, '/dashboard', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/discord-dashboard', (req, res) => {
        if (!req.session.user)
            return res.redirect('/auth?back_redirect=/discord-dashboard')

        if (!req.session.user.admin)
            return res.status(403).redirect('/discord-dashboard/v2')

        return next_app.render(req, res, '/discord-dashboard', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.get('/discord-dashboard/v2', async (req, res) => {
        if (!req.session.user)
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

    app.get('/discord-dashboard/project/:projectId', async (req, res) => {
        if (!req.session.user)
            return res.redirect('/auth?back_redirect=/discord-dashboard')

        if (!req.session.user.admin)
            return res.status(403).redirect('/discord-dashboard/v2')

        const projectId = req.params.projectId
        if (!req.session.user)
            return res.redirect('/auth?back_redirect=/discord-dashboard/project/' + projectId)

        const ProjectData = await Project.findOne({
            url: req.url,
            _id: projectId,
        })

        if (!ProjectData)
            return res.redirect('/discord-dashboard?error=Project not found')

        if (ProjectData.owner != req.session.user._id)
            return res.redirect('/auth?back_redirect=/discord-dashboard/project/' + projectId + `&error=You are not authorized to access this project. Please use proper account.`)

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
        if (!req.session.user)
            return res.redirect('/auth?back_redirect=/partnership')
        return next_app.render(req, res, '/partnership', {
            url: req.url,
            user: req.session.user,
        })
    })

    app.use(express.static(path.join(__dirname, './public'),))

    /*
     *  AOS assets v2 (old) support
     */
    app.use(express.static(path.join(__dirname, './assets-v2'), { redirect: false }))


    app.all('*', (req, res) => next_handle(req, res))

    return app
}

let userCache = {};
let checked = [];

// Find the users for the given IP address
async function findUsersByIp(ip) {
    if (userCache[ip]) {
        // If the users are already in the cache, return them
        return userCache[ip];
    } else {
        // Otherwise, query the database and cache the users
        const users = await User.find({ ip_address: ip });
        userCache[ip] = users;
        return users;
    }
}

// Update the known accounts for the given user and IP address
async function updateKnownAccounts(ip, user) {
    if (checked.includes(user._id.toString())) return;
    checked.push(user._id.toString());

    const users = await findUsersByIp(ip);
    let user_ids = users.map(u => u._id).filter(id => id.toString() !== user._id.toString());

    if (user.ip_address !== ip || user.known_accounts !== user_ids) {
        user.ip_address = ip;
        user.known_accounts = user_ids;

        await user.save();
    }

    for (const u of users) {
        if (u._id.toString() !== user._id.toString() && !checked.includes(u._id.toString())) {
            checked.push(u._id.toString());
            user_ids = users.map(u => u._id).filter(id => id.toString() !== u._id.toString());

            if (u.known_accounts !== user_ids || user.suspended?.enabled || (u.suspended?.enabled && !user.suspended?.enabled)) {
                if(u.known_accounts !== user_ids) u.known_accounts = user_ids;
                if(u.suspended?.enabled && !user.suspended?.enabled) {
                    user.suspended = u.suspended;
                    await user.save();
                }
                if(user.suspended?.enabled) u.suspended = user.suspended;

                await u.save();
            }
        }
    }
}

setInterval(() => userCache = {}, 1000 * 60 * 60 * 12);
setInterval(() => checked = [], 1000 * 60 * 5);


module.exports = {
    vhost,
    prodPort: process.env.PROD_BUT_BETA === "TRUE" ? 2000 : 3000
}
