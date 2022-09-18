const DiscordDashboard = require(__models + 'discordDashboard')

module.exports.UserLicenseStatus = async (user_id) => {
    const DBD_Data = await DiscordDashboard.findOne({
        user: user_id,
    })

    if(DBD_Data?.plan?.active_until && (DBD_Data.plan.active_until < new Date()))
        return {
            type: "free",
            expired_on: DBD_Data.plan.active_until
        }

    return {
        type: DBD_Data?.plan?.plan_type ?? "free",
        canceled: DBD_Data?.canceled,
        active_until: DBD_Data?.plan?.active_until ?? undefined,
    }
}