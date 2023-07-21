const { Schema, model } = require('mongoose')

const WorkspaceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ''
    },
    members: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    orgName: {
        type: String,
        required: true,
    },
    archived: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

const Workspace = model('Workspace', WorkspaceSchema)

module.exports = Workspace