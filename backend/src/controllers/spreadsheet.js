const Spreadsheet = require('../models/Spreadsheet')
const mongoose = require('mongoose')
const Workspace = require('../models/Workspace')


const createSpreadsheet = async (req, res) => {
    try {
        const { name, description, workspaceId } = req.body

        if (!name?.trim()) {
            return res.status(400).json({ message: 'Name is required' })
        }
        if (!workspaceId) {
            return res.status(400).json({ message: 'Workspace id is required' })
        }
        if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
            return res.status(400).json({ message: 'Invalid workspace id' })
        }

        const nameExists = await Spreadsheet.findOne({ name })

        if (nameExists) {
            return res.status(400).json({ message: 'Name exists' })
        }

        const workspace = await Workspace.findOne({ _id: workspaceId, orgName: req.user.orgName, members: { $in: [req.user._id] }, archived: false })

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' })
        }

        const spreadsheet = await Spreadsheet.create({
            name,
            description,
            workspace: workspaceId,
        })

        res.status(201).json({ message: 'Spreadsheet created', spreadsheet })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

const getSpreadsheet = async (req, res) => {
    try {
        const id = req.params.id
        const spreadsheet = await Spreadsheet.findById(id).populate('workspace')

        if (!spreadsheet) {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        const workspace = await Workspace.findById(spreadsheet.workspace)

        const userInWorkspace = workspace.members.find((member) => (
            String(member) == String(req.user._id)
        ))

        if (!userInWorkspace) {
            return res.status(404).json({ message: 'Spreadsheet not found' })
        }

        return res.status(200).json({ spreadsheet })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Something went wrong' })
    }
}


module.exports = {
    createSpreadsheet,
    getSpreadsheet
}