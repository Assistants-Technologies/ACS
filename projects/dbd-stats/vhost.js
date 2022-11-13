const express = require('express')
const StatsProjectAuthorize = require(__main_utils + './DiscordDashboardStatsProjectAuthorize')

const vhost = ({next_app, next_handle, client}) => {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))

    app.use('/api/stats', StatsProjectAuthorize, require('./stats/route'))

    return app
}


module.exports = {
    vhost,
    prodPort: process.env.PROD_BUT_BETA === "TRUE" ? 2007 : 3007
};
