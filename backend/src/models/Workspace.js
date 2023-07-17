const { Schema, model } = require('mongoose')

const WorkspaceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }, 
    description: {
        type: String,
        required: true
    },
    members: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    orgName: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true})

const Workspace = model('Workspace', WorkspaceSchema)

module.exports = Workspace