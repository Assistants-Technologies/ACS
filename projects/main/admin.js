const express = require('express')
const router = express.Router()

const User = require('../../models/user')

router.get('/users/list', async (req, res) => {
    if (!req.session?.user)
        return res.redirect('/auth?back_redirect=/admin/users/list')
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    req.next_app.render(req, res, '/admin/users', {
        url: req.url,
        user: req.session.user,
    })
});

router.get('/support', async (req, res) => {
    if (!req.session?.user)
        return res.redirect('/auth?back_redirect=/admin/users/list')
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    req.next_app.render(req, res, '/admin/questions/questions', {
        url: req.url,
        user: req.session.user,
    })
})

router.get('/support/edit/:id', async (req, res) => {
    if (!req.session?.user)
        return res.redirect('/auth?back_redirect=/admin/support/create')
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    req.next_app.render(req, res, '/admin/questions/edit', {
        url: req.url,
        user: req.session.user,
        question: req.params.id
    })
})

router.get('/support/create', async (req, res) => {
    if (!req.session?.user)
        return res.redirect('/auth?back_redirect=/admin/support/create')
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    req.next_app.render(req, res, '/admin/questions/create', {
        url: req.url,
        user: req.session.user,
    })
})

router.get('/manage', async (req, res) => {
    if (!req.session?.user)
        return res.redirect('/auth?back_redirect=user')
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    req.next_app.render(req, res, '/admin/manage', {
        url: req.url,
        user: req.session.user,
    })
})

module.exports = router