const uuidv4 = require('uuid').v4

const User = require('../models/user')
const LicensesList = require('../models/licensesList')
const mongoose = require("mongoose");

module.exports = {
    digital_items: [
        {
            id: "dbd_opensource_license",
            name: "OpenSource DBD v2 License",
            description: "This license is for the OpenSource DBD v2 project. It is free to use and can be used by anyone.",
            price: 0,
            owns_already: async ({ user_id }) => {
                const user = await User.findOne({ _id: user_id })
                return user?.OpenSource?.license_id == null ? false : true
            },
            assign_item: async ({ Session }) => {
                const user_id = Session.user._id
                const user = await User.findOne({ _id: user_id })

                const license = uuidv4()
                user.OpenSource = {
                    payment_id: 'UNKNOWN',
                    license_type: 'opensource',
                    status: 'approved',
                    license_id: license,
                }
                await user.save()

                await LicensesList.create({
                    user: user_id,
                    payment_id: 'UNKNOWN',
                    license_id: license,
                    license_type: 'opensource',
                })

                return true
            }
        },
        {
            id: "dbd_personal_license",
            name: "Personal DBD v2 License",
            description: "This license is for the Personal DBD v2 project. It allows profit-making from the project.",
            price: 1000,
            owns_already: async ({ user_id }) => {
                const user = await User.findOne({ _id: user_id })
                return user?.Personal?.license_id == null ? false : true
            },
            assign_item: async ({ Session }) => {
                const user_id = Session.user._id
                const user = await User.findOne({ _id: user_id })

                const license = uuidv4()
                user.Personal = {
                    payment_id: 'UNKNOWN',
                    license_type: 'personal',
                    status: 'approved',
                    license_id: license,
                }
                await user.save()

                await LicensesList.create({
                    user: user_id,
                    payment_id: 'UNKNOWN',
                    license_id: license,
                    license_type: 'personal',
                })

                return true
            }
        },
        {
            id: "dbd_production_license",
            name: "Production DBD v2 License",
            description: "This license is for the Personal DBD v2 project. It allows profit-making from the project. It can be shared with friends.",
            price: 10000,
            owns_already: async ({ user_id }) => {
                const user = await User.findOne({ _id: user_id })
                return user?.Production?.license_id == null ? false : true
            },
            assign_item: async ({ Session }) => {
                const user_id = Session.user._id
                const user = await User.findOne({ _id: user_id })

                const license = uuidv4()
                user.Production = {
                    payment_id: 'UNKNOWN',
                    license_type: 'production',
                    status: 'approved',
                    license_id: license,
                }
                await user.save()

                await LicensesList.create({
                    user: user_id,
                    payment_id: 'UNKNOWN',
                    license_id: license,
                    license_type: 'production',
                })

                return true
            }
        }
    ]
}