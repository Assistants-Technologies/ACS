const DiscordDashboard = require('../../../../../../models/discordDashboard')

module.exports = async (user_id) => {
    const dbd = await DiscordDashboard.findOne({
        user: user_id,
    })

    return {
        type: dbd?.plan?.plan_type || 'free',
        active: dbd?.plan?.active
    }
}