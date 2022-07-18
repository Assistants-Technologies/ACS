const mongoose = require('mongoose')
const {
    Schema
} = require('mongoose')

const viewSchema = new Schema(
    {
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DBDProject',
            required: true,
        },
        website_url: {
            type: String,
            default: 'UNKNOWN',
        },
        user_id: {
            type: String,
            required: true,
            default: 'NONE',
        },
        country: {
            type: String,
            required: true,
            default: 'UNKNOWN',
        }
    },
    {
        timestamps: true,
    }
)

const DBDProjectStatsView = mongoose.model('DBDProjectStatsView', viewSchema)

module.exports = DBDProjectStatsView
