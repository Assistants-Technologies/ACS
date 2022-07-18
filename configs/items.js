const User = require('../models/user');

module.exports = {
    items: [
        {
            name: "1000 Coins",
            id: "1000_coins",
            prices: {
                "PLN": "price_1LCqaOKWxgCmg6Sf8P9NeQqg",
                "EUR": "price_1LCqrNKWxgCmg6SfgHncFhXk",
                "USD": "price_1LCqp6KWxgCmg6SfUdCf7vjw",
                "GBP": "price_1LCrS9KWxgCmg6Sf9uenU2c2"
            },
            assign_item: async ({ Session }) => {
                const user_id = Session.user
                const user = await User.findOne({ _id: user_id })

                const coins = user.coins
                user.coins = coins + 1000
                await user.save()

                return true
            }
        }
    ],
    paymentTypes: {
        "PLN": ["p24", "card"],
        "EUR": ["p24", "card", "sofort"],
        "USD": ["card"],
        "GBP": ["card",]
    },
}