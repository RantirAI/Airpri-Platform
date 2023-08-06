const Spreadsheet = require("../models/Spreadsheet")
const Workspace = require("../models/Workspace")

const authorizeSpreadsheetAccess = async (req, res) => {
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

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

module.exports = authorizeSpreadsheetAccess