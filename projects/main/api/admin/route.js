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

        for (const category of digital_items) {
            let cat_temp = { categoryName: category.categoryName, categoryDescription: category.categoryDescription, categoryItems: [], categoryId: category.categoryId }
            for (const item of category.categoryItems) {
                const owns = await item.owns_already({ user_id })
                cat_temp.categoryItems.push({ ...item, owns })
            }
            user_owned.push(cat_temp)
        }

        return res.send({ error: false, items: user_owned })
    });

router.route('/users/edit/:type/:id').post(async (req, res) => {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()
    const { type, id } = req.params
    if (!type || !id) return res.send({ error: true, message: 'Missing type or id' });

    const user = await User.findOne({ _id: id });
    if (!user) return res.send({ error: true, message: 'User not found' });

    if (type === "permissions") {
        if (user.admin && req.session.user.assistants_username !== "breathtake") return res.send({ error: true, message: 'You can\'t edit admin users' });
        user.admin = req.body.admin;
        user.og = req.body.og;
        user.blog_permissions = req.body.blog_permissions;
        user.verified = req.body.verified;

        await user.save();
        return res.send({ error: false, message: 'User permissions updated' });
    } else if (type === "coins") {
        if (req.body.coins < 0 || !req.body.coins) return res.send({ error: true, message: 'Coins must be > 1' });

        user.coins = req.body.coins;
        await user.save();
        return res.send({ error: false, message: 'User coins updated' });
    } else if (type === "email") {
        if (!req.body.email) return res.send({ error: true, message: 'Email is required' });
        if (!req.body.email.includes("@")) return res.send({ error: true, message: 'Email is invalid' });

        let exists = await User.findOne({ email: req.body.email });
        if (exists) return res.send({ error: true, message: 'Email already exists' });

        user.email = req.body.email;
        await user.save();
        return res.send({ error: false, message: 'User email updated' });
    } else if (type === "known_accounts") {
        user.known_accounts = [];
        await user.save();

        return res.send({ error: false, message: 'User known accounts cleared' });
    }
});

router.route('/users/warn/:id').post(async (req, res) => {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()
    const { id } = req.params;
    if (!id) return res.send({ error: true, message: 'Missing id' });

    const user = await User.findOne({ _id: id });
    if (!user) return res.send({ error: true, message: 'User not found' });

    if (user.warnings.find(w => w.active === true)) return res.send({ error: true, message: 'User already has an active warning' });
    if (req.body.reason?.length < 5) return res.send({ error: true, message: 'Reason must be at least 5 characters' });

    user.warnings.push({
        active: true,
        reason: req.body.reason,
        date: Date.now(),
        admin: req.session.user.assistants_username
    });

    await user.save();

    return res.send({ error: false, message: 'User warned' });
});

router.route('/users/suspend/:id').post(async (req, res) => {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()
    const { id } = req.params;
    if (!id) return res.send({ error: true, message: 'Missing id' });

    const user = await User.findOne({ _id: id });
    if (!user) return res.send({ error: true, message: 'User not found' });

    if (user.suspended?.enabled) return res.send({ error: true, message: 'User is already suspended' });
    if (req.body.reason?.length < 5) return res.send({ error: true, message: 'Reason must be at least 5 characters' });

    let expiresAt = 0;

    if (req.body.expires) {
        expiresAt = new Date(req.body.expiresAt).getTime();
        if (expiresAt <= Date.now()) return res.send({ error: true, message: 'Expires at must be in the future' });
    }

    user.suspended.enabled = true;
    user.suspended.reason = req.body.reason;
    user.suspended.until = req.body.expires ? expiresAt : null;
    user.suspended.admin = req.session.user.assistants_username;

    await user.save();

    return res.send({ error: false, message: 'User suspended' });
});

router.route('/users/reactivate/:id').post(async (req, res) => {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()
    const { id } = req.params;
    if (!id) return res.send({ error: true, message: 'Missing id' });

    const user = await User.findOne({ _id: id });
    if (!user) return res.send({ error: true, message: 'User not found' });

    if (!user.suspended?.enabled) return res.send({ error: true, message: 'User isn\'t suspended' });

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
                if (!u.suspended?.enabled) return;
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

    return res.send({ error: false, message: 'User reactivated' });
});

router.route('/users/warnings/acknowledge/:id').post(async (req, res) => {
    const user = await User.findOne({ _id: req.session.user?._id });
    if (!user) return res.send({ error: true, message: 'User not found' });

    if (!user.warnings.find(w => w.active === true && w.date === req.body.warning.date)) return res.send({ error: true, message: 'Warning not found' });

    const warnings = user.warnings;
    warnings[warnings.findIndex(w => w.active === true && w.date === req.body.warning.date)].active = false;

    user.warnings = warnings;
    await User.findOneAndUpdate({ _id: req.session.user?._id }, { $set: { warnings: user.warnings } });

    req.session.user = user;

    return res.send({ error: false, message: 'Warning successfully acknowledged' });
});

router.route('/users/warnings/clear/:id').post(async (req, res) => {
    if (req.session?.user?.admin !== true) return res.status(403).send();

    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.send({ error: true, message: 'User not found' });

    user.warnings = [];
    await user.save();

    req.session.user = user;

    return res.send({ error: false, message: 'Warnings successfully cleared' });
});

//const Addon = require('../../../../models/addon') not currently integrated by the looks of it!
const LicenseList = require('../../../../models/licensesList')
const LicenseAccessTokensList = require('../../../../models/licensesAccessTokensList')
const Partnership = require('../../../../models/partnership')
const PartnershipRequest = require('../../../../models/partnershipRequest')
const TwitterTokens = require('../../../../models/twitterTokens')
const DiscordDashboard = require('../../../../models/discordDashboard')
const EmailConfirmation = require('../../../../models/emailConfirmation')
const DailyShop = require('../../../../models/TwitterTools/dailyShop')
const CheckoutSession = require('../../../../models/Shop/checkoutSession')
const ShopPayment = require('../../../../models/Shop/payment')
const StripeAccount = require('../../../../models/DiscordDashboardV3/stripeAccount')
const DBDProject = require('../../../../models/DBDStats/dbd_project')
const DBDProjectAuthSuccess = require('../../../../models/DBDStats/Auth/auth_success')
const DBDProjectStatsView = require('../../../../models/DBDStats/Views/view')

router.route('/users/delete/:id').post(async (req, res) => {
    if (req.session?.user?.admin !== true) return res.status(403).send();

    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.send({ error: true, message: 'User not found' });

    if (user.admin && req.session.user.assistants_username !== "breathtake") return res.send({ error: true, message: 'You can\'t delete an admin account' });

    (await LicenseList.find({ user: user._id })).forEach(license => {
        license.delete();
    })

    if (user.account_access_token) {
        const token = await LicenseAccessTokensList.findOne({ access_token: user.account_access_token });
        if (token) token.delete();
    }

    const partnership = await Partnership.findOne({ user: user._id });
    if (partnership) partnership.delete();

    const partnershipRequest = await PartnershipRequest.findOne({ user: user._id });
    if (partnershipRequest) partnershipRequest.delete();

    const twitterTokens = await TwitterTokens.findOne({ user: user._id });
    if (twitterTokens) twitterTokens.delete();

    const discordDashboard = await DiscordDashboard.findOne({ user: user._id });
    if (discordDashboard) {
        for (const project of discordDashboard.projects) {
            const dbdProject = await DBDProject.findOne({ _id: project });
            if (dbdProject) dbdProject.delete();
        }

        discordDashboard.delete();
    }

    const emailConfirmation = await EmailConfirmation.findOne({ user: user._id });
    if (emailConfirmation) emailConfirmation.delete();

    const dailyShop = await DailyShop.findOne({ user: user._id });
    if (dailyShop) dailyShop.delete();

    const checkoutSession = await CheckoutSession.find({ user: user._id });
    if (checkoutSession?.length) checkoutSession.forEach(session => session.delete());

    const shopPayment = await ShopPayment.find({ user: user._id });
    if (shopPayment?.length) shopPayment.forEach(sp => sp.delete());

    const stripeAccount = await StripeAccount.findOne({ user: user._id });
    if (stripeAccount) stripeAccount.delete();

    const dbdProjectAuthSuccess = await DBDProjectAuthSuccess.find({ user: user._id });
    if (dbdProjectAuthSuccess?.length) dbdProjectAuthSuccess.forEach(dpas => dpas.delete());

    const dbdProjectStatsView = await DBDProjectStatsView.find({ user: user._id });
    if (dbdProjectStatsView?.length) dbdProjectStatsView.forEach(dpsv => dpsv.delete());

    return res.send({ error: false, message: 'Account \'yeeted\' out of existence.' });
});

module.exports = router