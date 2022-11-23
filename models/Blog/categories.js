const mongoose = require('mongoose')
const {
    Schema
} = require('mongoose')

const blogCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

const DBDProject = mongoose.model('BlogCategory', blogCategorySchema)

module.exports = DBDProject
