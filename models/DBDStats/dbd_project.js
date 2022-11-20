const mongoose = require('mongoose')
const {
    Schema
} = require('mongoose')

const dbdProjectSchema = new Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        theme: {
            type: Object,
            default: {
                name: null,
                codename: null,
                version: null,
            },
        },
    },
    {
        timestamps: true,
    }
)

const DBDProject = mongoose.model('DBDProject', dbdProjectSchema)

module.exports = DBDProject
