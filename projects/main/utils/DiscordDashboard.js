const DiscordDashboard = require('../../../models/discordDashboard')

module.exports.UserLicenseStatus = async (user_id) => {
    const DBD_Data = await DiscordDashboard.findOne({
        user: user_id,
    })

    return {
        type: DBD_Data?.plan?.plan_type ?? "free",
        active_until: DBD_Data?.plan?.active_until ?? undefined,
    }
}