const express = require('express')
const router = express.Router()

const User = require('../../../../../models/user')

const { digital_items } = require('../../../../../configs/digitalItems')
let digital_items_line = []

for(const category of digital_items) {
    digital_items_line = [...category.categoryItems, ...digital_items_line]
}

router.get('/get', async (req, res) => {
    if(!req.session?.user){
        return res.status(400).json({
            error:true,
            message: "Not authenticated"
        })
    }

    let user_owned = []

    for(const category of digital_items) {
        let cat_temp = {categoryName: category.categoryName, categoryDescription: category.categoryDescription, categoryItems: []}
        for(const item of category.categoryItems) {
            const owns = await item.owns_already({ user_id: req.session?.user?._id })
            cat_temp.categoryItems.push({ ...item, owns })
        }
        user_owned.push(cat_temp)
    }

    return res.status(200).json({
        error: false,
        items: user_owned
    })
})

router.post('/buy/:item_id', async (req, res) => {
    if(!req.session?.user){
        return res.status(400).json({
            error:true,
            message: "Not authenticated"
        })
    }

    const item_id = req.params.item_id
    const item = digital_items_line.find(item => item.id == item_id)

    if(!item) {
        return res.status(400).json({
            error: true,
            message: "Item not found"
        })
    }

    const owns = await item.owns_already({ user_id: req.session?.user?._id })

    if(owns) {
        return res.status(400).json({
            error: true,
            message: "You already own this item"
        })
    }

    const user_coins = await User.findOne({ _id: req.session?.user?._id }).select('coins');
    if(user_coins.coins < item.price) {
        return res.status(400).json({
            error: true,
            message: "You don't have enough coins"
        })
    }

    const assign = await item.assign_item({ Session: req.session });
    if(!assign) {
        return res.status(400).json({
            error: true,
            message: "Something went wrong"
        })
    }

    await User.findOneAndUpdate({ _id: req.session?.user?._id }, {
        $inc: { coins: -item.price }
    })

    return res.status(200).json({
        error: false,
        message: "Item purchased"
    })
})

module.exports = router
