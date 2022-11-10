const mongoose = require('mongoose')
const {
    Schema
} = require('mongoose')

const authSchema = new Schema(
    {
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DBDProject',
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            sparse: true,
            default: null,
        },
        country: {
            type: String,
            sparse: true,
            default: null,
        }
    },
    {
        timestamps: true,
    }
)

const DBDProjectAuthSuccess = mongoose.model('DBDProjectAuthSuccess', authSchema)

module.exports = DBDProjectAuthSuccess
