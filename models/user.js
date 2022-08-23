const mongoose = require('mongoose')
const {
    Schema
} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
// branch test
const userSchema = new Schema({
    account_access_token: {
        type: String,
        default: null,
        sparse: true,
    },
    assistants_username: {
        type: String,
        unique: true,
        required: true,
        uniqueCaseInsensitive: true
    },
    allow_optional_emails: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String,
        default: ''
    },
    avatarURL: {
        type: String,
        default: 'https://assistantscenter.com/wp-content/uploads/2021/11/cropped-cropped-logov6.png'
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: String,
    connections: {
        twitter: {
            id: {
                type: String,
                unique: true,
                sparse: true,
            },
        },
        discord: {
            id: {
                type: String,
                unique: true,
                sparse: true
            }
        }
    },
    coins: {
        type: Number,
        default: 0,
    },
    verified: {
        type: Boolean,
        default: false
    },
    og: {
        type: Boolean,
        default: false
    },
    admin: {
        type:Boolean,
        default: false,
    },
    premium_boost: {
        type: Boolean,
        default: false,
    },
    blog_permissions: {
        type: Boolean,
        default: false,
    },
    OpenSource: {
        payment_id: {
            type: String,
            default: null,
            sparse: true
        },
        license_type: {
            type: String,
            default: null,
            sparse: true
        },
        license_id: {
            type: String
        },
        status: {
            default: null,
            sparse: true,
            type: String,
        },
    },
    Personal: {
        payment_id: {
            type: String,
            default: null,
            sparse: true
        },
        license_type: {
            type: String,
            default: null,
            sparse: true
        },
        license_id: {
            type: String
        },
        status: {
            default: null,
            sparse: true,
            type: String,
        },
    },
    Production: {
        payment_id: {
            type: String,
            default: null,
            sparse: true
        },
        license_id: {
            type: String
        },
        license_type: {
            type: String,
            default: null,
            sparse: true
        },
        status: {
            default: null,
            sparse: true,
            type: String,
        },
    }
});

userSchema.plugin(uniqueValidator, {
    message: 'Error, expected {PATH} to be unique.'
})

const User = mongoose.model('User', userSchema)

module.exports = User
