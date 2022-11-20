const DiscordDashboard = require(__models + 'discordDashboard')
const Addon = require(__models + 'addon')

module.exports.UserLicenseStatus = async (user_id) => {
    const DBD_Data = await DiscordDashboard.findOne({
        user: user_id,
    })

    const UserAddons = await Addon.find({
        user: user_id,
        parent_id: 'discord-dashboard-v3'
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
        addons: UserAddons
    }
}
