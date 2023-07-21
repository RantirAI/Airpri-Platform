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
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
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
    }
})

const Spreadsheet = model('Spreadsheet', SpreadsheetSchema)

module.exports = Spreadsheet