const { Schema, model } = require('mongoose')

const ColumnSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true
    },
    editable: {
        type: Boolean,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

const SpreadsheetSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String, 
        default: ''
    },
    workspace: {
        ref: 'Workspace',
        type: Schema.Types.ObjectId,
        required: true
    },
    columns: {
        type: [ColumnSchema],
        default: [
            {
                title: "Name",
                id: "name",
                editable: true,
                icon: "headerString",
                type: "text"
            },
        ],
    },
    rows: {
        type: [{ type: Schema.Types.Mixed }],
        default: [{
            'name': ""
        }]
    },
    archived: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Spreadsheet = model('Spreadsheet', SpreadsheetSchema)

module.exports = Spreadsheet