const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    orgName: {
        type: String,
        required: true,
        trim: true,
    },
})

const User = model('User', UserSchema)

module.exports = User