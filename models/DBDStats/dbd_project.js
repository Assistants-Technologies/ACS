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
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const DBDProject = mongoose.model('DBDProject', dbdProjectSchema)

module.exports = DBDProject
