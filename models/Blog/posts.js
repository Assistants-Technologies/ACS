const mongoose = require('mongoose')
const {
    Schema
} = require('mongoose')

const blogPostSchema = new Schema(
    {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BlogCategory',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
)

const DBDProject = mongoose.model('BlogPost', blogPostSchema)

module.exports = DBDProject
