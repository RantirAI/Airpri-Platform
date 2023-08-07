const Spreadsheet = require("../models/Spreadsheet")
const Workspace = require("../models/Workspace")

const authorizeSpreadsheetAccess = async (req, res, next) => {
    try {
        const id = req.params.id
        const spreadsheet = await Spreadsheet.findById(id).populate('workspace')

        if (!spreadsheet) {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        const workspace = await Workspace.findById(spreadsheet.workspace)

        const userInWorkspace = workspace?.members.find((member) => (
            String(member) == String(req.user._id)
        ))

        if (!userInWorkspace) {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        next()

    } catch (error) {
        console.log(error.message)
        res.sendStatus(500)
    }
}

module.exports = authorizeSpreadsheetAccess