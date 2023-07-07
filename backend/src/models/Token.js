const { Schema, model } = require('mongoose')

const TokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, purpose: {
        type: String,
        required: true
    }, createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    }, used: {
        type: Boolean,
        required: true,
        default: false
    }
})

const Token = model('Token', TokenSchema)

module.exports = Token