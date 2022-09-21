const { UserLicenseStatus } = require('../../../utils/DiscordDashboard')

const express = require('express')
const router = express.Router()
const uuidv4 = require('uuid').v4

const { VerifyToken } = require('../../../utils/AccountAuthorization')

const digitalItems = require('../../../../../configs/digitalItems').digital_items

const LicensesList = require('../../../../../models/licensesList')
const User = require('../../../../../models/user')

async function getUnusedLicense() {
    const li = uuidv4();
    const check = await LicensesList.findOne({
        license_id: li
    });

    if (check) return getUnusedLicense();
    return li;
}

router.get('/status', async (req, res) => {
    const account_access_token = req.headers.authorization || ''
    const user = await VerifyToken(account_access_token)

    if (typeof (user) == 'string')
        return res.send({ error: true, message: user })

    const license_status = await UserLicenseStatus(user._id)

    return res.send({ error: false, license_status })
})

router.get('/status/session', async (req, res) => {
    if (!req.session.user)
        return res.send({
            error: true,
            message: "Not authorized"
        })
    const license_status = await UserLicenseStatus(req.session.user._id)

    return res.send({ error: false, license_status })
})

router.post('/revoke', async (req, res) => {
    console.log("ran")

    const { user_id, item_id, category_id } = req.body
    if (!user_id) return res.send({ error: true, message: 'Missing user_id' })
    if (!category_id || !item_id) return res.send({ error: true, message: 'Missing item information' })

    const category = digitalItems.find(category => category.categoryId === category_id)

    const item = category.categoryItems.find(item => item.id === item_id)
    if (!item) 
        return res.send({ error: true, message: "Item not found" })

    const user = await User.findOne({ _id: user_id })
    if (!user) return res.send({ error: true, message: 'User not found' })

    if (category.categoryId === "dbd-license") {
        if (item.id === `dbd_opensource_license`) {
            await LicensesList.findOneAndRemove({ license_id: user.OpenSource.license_id })
            await User.findOneAndUpdate({ _id: user_id }, { $set: { "OpenSource.license_id": null, "Production.payment_id": null, "Production.license_type": null, "Production.status": null } })
        }
        if (item.id === `dbd_personal_license`) {
            await LicensesList.findOneAndRemove({ license_id: user.Personal.license_id })
            await User.findOneAndUpdate({ _id: user_id }, { $set: { "Personal.license_id": null, "Production.payment_id": null, "Production.license_type": null, "Production.status": null } })
        }
        if (item.id === `dbd_production_license`) {
            await LicensesList.findOneAndRemove({ license_id: user.Production.license_id })
            await User.findOneAndUpdate({ _id: user_id }, { $set: { "Production.license_id": null, "Production.payment_id": null, "Production.license_type": null, "Production.status": null } })
        }
    } else {
        await LicensesList.findOneAndRemove({ license_id: user.productLicenses.find(license => license.itemID === item.id).licenseID })
        
        await User.findOneAndUpdate({ _id: user_id },
            {
                $pull: {
                    productLicenses: {
                        itemID: item.id
                    }
                },
            },
            { safe: true, multi: false }
        );
    }
    
    return res.send({ error: false, message: 'License revoked' })
})

router.post('/assign', async (req, res) => {
    const { user_id } = req.body
    if (!user_id) return res.send({ error: true, message: 'Missing user_id' })

    const reqCategory = req.body.category_id
    const reqItem = req.body.item_id

    const item = digitalItems.find(category => category.categoryId === reqCategory).categoryItems.find(item => item.id === reqItem)

    if (!item) 
        return res.send({ error: true, message: "Item not found" })

    const verified = await item.assign_item({
        Session: {
            user: {
                _id: user_id,
            },
        }
    })

    return res.send({ error: verified })
})

router.post('/regen/dbd', async (req, res) => {
    if (!req.session.user)
        return res.send({
            error: true,
            message: "Not authorized"
        })

    const type = req.query.type

    if (!type || type !== 'production' && type !== 'personal' && type != 'opensource') return res.send({
        error: true,
        message: "Invalid type"
    })

    const dbditems = digitalItems.find(item => item.categoryId === "dbd-license").categoryItems

    const item = dbditems.find(item => item.id === `dbd_${type}_license`)
    if (!item) return res.send({ error: true, message: "Item not found" })

    const assistantsUser = await User.findOne({
        _id: req.session.user._id
    });

    if (!assistantsUser) return res.send({
        error: true,
        message: "User not found"
    })

    let lice;
    if (item.id === `dbd_opensource_license`) lice = assistantsUser.OpenSource.license_id;
    if (item.id === `dbd_personal_license`) lice = assistantsUser.Personal.license_id;
    if (item.id === `dbd_production_license`) lice = assistantsUser.Production.license_id;

    if (!lice) return res.send({
        error: true,
        message: "You do not own this license"
    })

    const license = await LicensesList.findOne({
        license_id: lice
    });

    if (!license) return res.send({
        error: true,
        message: "License does not exist"
    })

    const newLicense = await getUnusedLicense();

    if (item.id === `dbd_opensource_license`) assistantsUser.OpenSource.license_id = newLicense;
    if (item.id === `dbd_personal_license`) assistantsUser.Personal.license_id = newLicense;
    if (item.id === `dbd_production_license`) assistantsUser.Production.license_id = newLicense;

    await assistantsUser.save()

    license.license_id = newLicense;
    await license.save();

    return res.send({ error: false, newLicense })
})

router.post('/regen/addon', async (req, res) => {
    if (!req.session.user)
        return res.send({
            error: true,
            message: "Not authorized"
        })

    const type = req.query.type

    if (!type) return res.send({
        error: true,
        message: "Invalid type"
    })

    const dbditems = digitalItems.find(item => item.categoryId === "soft-ui-addons").categoryItems

    const item = dbditems.find(item => item.id === `sui_addon_${type}`)
    if (!item) return res.send({ error: true, message: "Item not found" })

    const user = await User.findOne({
        _id: req.session.user._id
    });

    if (!user) return res.send({
        error: true,
        message: "User not found"
    })

    const index = user.productLicenses.findIndex(l => l.itemID === item.id);

    const db = await LicensesList.findOne({
        licenseID: user.productLicenses[index].licenseID
    });

    const newLicense = await getUnusedLicense();

    let newOne = user.productLicenses[index];
    newOne.licenseID = newLicense;
    user.productLicenses[index] = newOne;

    db.license_id = newLicense;

    await db.save();
    await user.save();

    return res.json({ error: false, newLicense });
})

module.exports = router