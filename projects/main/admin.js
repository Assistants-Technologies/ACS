const express = require('express')
const router = express.Router()

const User = require('../../models/user')

router.route('/users/list')
    .get(async(req,res) => {
        if(!req.session?.user)
            return res.redirect('/auth?back_redirect=/admin/users/list')
        if(req.session?.user?.admin !== true)
            return res.status(403).send()

        req.next_app.render(req, res, '/admin/users', {
            url: req.url,
            user: req.session.user,
        })
    })

module.exports = router