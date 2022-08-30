const User = require('../models/user');

module.exports = (dev) => {
    return {
        items: [
            {
                name: "300 Coins",
                id: "300_coins",
                prices: {
                    "PLN": dev ? "price_1LSQQ8KWxgCmg6SfIv0BYxJt" : "price_1LcYfmKWxgCmg6SfwYLgoQE5",
                    "EUR": dev ? "price_1LSQQ8KWxgCmg6SfIv0BYxJt" : "price_1LcYgEKWxgCmg6Sf8Ui51a8E",
                    "USD": dev ? "price_1LSQQ8KWxgCmg6SfIv0BYxJt" : "price_1LcYeaKWxgCmg6Sf3ykscAJj",
                    "GBP": dev ? "price_1LSQQ8KWxgCmg6SfIv0BYxJt" : "price_1LcYg5KWxgCmg6SfZV7sp5Pm"
                },
                assign_item: async ({ session, user_id }) => {
                    const user = await User.findOne({_id: user_id})

                    const coins = user.coins
                    user.coins = coins + 300
                    await user.save()

                    return true
                }
            },
            {
                name: "1.000 Coins",
                id: "1000_coins",
                prices: {
                    "PLN": dev ? "price_1LSQQ8KWxgCmg6SfIv0BYxJt" : "price_1LSQiXKWxgCmg6Sf7WI0H5mA",
                    "EUR": dev ? "price_1LSQQ8KWxgCmg6SfIv0BYxJt" : "price_1LSQjCKWxgCmg6SflpX6d84K",
                    "USD": dev ? "price_1LSQQ8KWxgCmg6SfIv0BYxJt" : "price_1LSQjQKWxgCmg6SfcI2iCPvw",
                    "GBP": dev ? "price_1LSQQ8KWxgCmg6SfIv0BYxJt" : "price_1LSQjgKWxgCmg6SfcayDiZ0g"
                },
                assign_item: async ({ session, user_id }) => {
                    const user = await User.findOne({_id: user_id})

                    const coins = user.coins
                    user.coins = coins + 1000
                    await user.save()

                    return true
                }
            },
            {
                name: "3.000 Coins",
                id: "3000_coins",
                prices: {
                    "PLN": dev ? "price_1LSQXnKWxgCmg6SfQdTRx4dK" : "price_1LSQkrKWxgCmg6Sfag2zWMaR",
                    "EUR": dev ? "price_1LSQXnKWxgCmg6SfQdTRx4dK" : "price_1LSQlIKWxgCmg6Sf84z5P3e6",
                    "USD": dev ? "price_1LSQXnKWxgCmg6SfQdTRx4dK" : "price_1LSQlPKWxgCmg6SfaAd1AQNO",
                    "GBP": dev ? "price_1LSQXnKWxgCmg6SfQdTRx4dK" : "price_1LSQleKWxgCmg6SflCh62LSk"
                },
                assign_item: async ({ session, user_id }) => {
                    const user = await User.findOne({_id: user_id})

                    const coins = user.coins
                    user.coins = coins + 3000
                    await user.save()

                    return true
                }
            },
            {
                name: "20.000 Coins",
                id: "20000_coins",
                prices: {
                    "PLN": dev ? "price_1LSQYvKWxgCmg6Sfa3acqhnF" : "price_1LSQmWKWxgCmg6Sf4xeoK6rm",
                    "EUR": dev ? "price_1LSQYvKWxgCmg6Sfa3acqhnF" : "price_1LSQmnKWxgCmg6Sfm8CfSUpj",
                    "USD": dev ? "price_1LSQYvKWxgCmg6Sfa3acqhnF" : "price_1LSQmvKWxgCmg6SfqBzL7Q6W",
                    "GBP": dev ? "price_1LSQYvKWxgCmg6Sfa3acqhnF" : "price_1LSQnEKWxgCmg6Sf7d6Mi9y1"
                },
                assign_item: async ({ session, user_id }) => {
                    const user = await User.findOne({_id: user_id})

                    const coins = user.coins
                    user.coins = coins + 20000
                    await user.save()

                    return true
                }
            },
            {
                name: "30.000 Coins",
                id: "30000_coins",
                prices: {
                    "PLN": dev ? "price_1LSQa4KWxgCmg6SfwUjwesc0" : "price_1LSQoLKWxgCmg6SfvUvOHXmw",
                    "EUR": dev ? "price_1LSQa4KWxgCmg6SfwUjwesc0" : "price_1LSQoqKWxgCmg6SfCkP4udnc",
                    "USD": dev ? "price_1LSQa4KWxgCmg6SfwUjwesc0" : "price_1LSQoyKWxgCmg6Sfyerbi6f1",
                    "GBP": dev ? "price_1LSQa4KWxgCmg6SfwUjwesc0" : "price_1LSQpCKWxgCmg6SfLQRtOEhl"
                },
                assign_item: async ({ session, user_id }) => {
                    const user = await User.findOne({_id: user_id})

                    const coins = user.coins
                    user.coins = coins + 30000
                    await user.save()

                    return true
                }
            }
        ],
        paymentTypes: {
            "PLN": ["p24", "card", "blik"],
            "EUR": ["p24", "card", "sofort"],
            "USD": ["card"],
            "GBP": ["card",]
        },
    }
}