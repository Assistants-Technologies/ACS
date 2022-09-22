const express = require('express')
const router = express.Router()

const User = require('../../../../models/user')
const { digital_items } = require(`${__configs}/digitalItems`)

router.use('/support/questions', require('./questions/route'))

router.route('/users/list')
    .get(async (req, res) => {
        if (req.session?.user?.admin !== true)
            return res.status(403).send()
        const users = await User.find({}).lean()

        for (let i in users) {
            delete users[i].account_access_token
            delete users[i].password
        }

        return res.send({ error: false, users })
    })


router.route('/items')
    .get(async (req, res) => {
        if (req.session?.user?.admin !== true)
            return res.status(403).send()

        let items = []

        digital_items.forEach(element => {
            items.push(element)
        });

        return res.send({ error: false, items })
    });

router.route('/items-owned')
    .post(async (req, res) => {
        const { user_id } = req.body;
        if (!user_id) return res.send({ error: true, message: 'Missing user_id' })

        let user_owned = []
    
        for(const category of digital_items) {
            let cat_temp = {categoryName: category.categoryName, categoryDescription: category.categoryDescription, categoryItems: [], categoryId: category.categoryId}
            for(const item of category.categoryItems) {
                const owns = await item.owns_already({ user_id })
                cat_temp.categoryItems.push({ ...item, owns })
            }
            user_owned.push(cat_temp)
        }

        return res.send({ error: false, items: user_owned })
    });

module.exports = router