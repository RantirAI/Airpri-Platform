const Spreadsheet = require("../models/Spreadsheet")
const Workspace = require("../models/Workspace")


const createWorkspace = async (req, res) => {
    try {
        const { name, description, members = [] } = req.body
        if (!name) {
            return res.status(400).json({ message: 'Name is required' })
        }

        const nameExists = await Workspace.findOne({ name, orgName: req.user.orgName })
        if (nameExists) {
            return res.status(400).json({ message: "Name is taken" })
        }

        const workspace = await Workspace.create({
            name,
            description,
            orgName: req.user.orgName,
            members: !(members.includes(String(req.user._id))) ? [...members, req.user._id] : members
        })

        res.status(201).json({ message: 'Workspace created', workspace })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

const editWorkspace = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, members } = req.body

        const workspace = await Workspace.findById(id)

        if (name) {
            const nameExists = await Workspace.findOne({ name })
            if (nameExists) {
                if (nameExists._id != id) {
                    return res.status(400).json({ message: "Name is taken" })
                } else {
                    workspace.name = name
                }
            } else {
                workspace.name = name
            }
        }

        if (description) {
            workspace.description = description
        }

        if (members) {
            workspace.members = !(members.includes(String(req.user._id))) ? [...members, req.user._id] : members
        }

        await workspace.save()

        res.status(200).json({ message: 'Workspace updated', workspace })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

const archiveWorkspace = async (req, res) => {
    try {
        const { id } = req.params

        const workspace = await Workspace.findById(id)

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' })
        }

        if (workspace.archived) {
            return res.status(400).json({ message: 'Workspace already archived' })
        }

        workspace.archived = true

        await workspace.save()

        res.status(200).json({ message: 'Workspace archived successfully' })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

const getWorkspaces = async (req, res) => {
    try {
        const { archived } = req.query
        const workspaces = await Workspace.find({ orgName: req.user.orgName, members: { $in: [req.user._id] }, archived: archived != undefined ? true : false }).populate('members')

        res.status(200).json({ workspaces })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

const deleteWorkspace = async (req, res) => {
    try {
        const { id } = req.params

        const workspace = await Workspace.findById(id)

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' })
        }

        await workspace.deleteOne()

        res.status(200).json({ message: 'Workspace deleted successfully' })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Something went wrong' })
    }
}

const getWorkspace = async (req, res) => {
    try {
        const { id } = req.params
        const { archived } = req.query

        const workspace = await Workspace.findOne({ _id: id, orgName: req.user.orgName, members: { $in: [req.user._id] }, archived: archived != undefined ? true : false })

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' })
        }

        const spreadsheets = await Spreadsheet.find({ workspace: id, archived: archived != undefined ? true : false })

        return res.status(200).json({ spreadsheets, workspace })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Something went wrong' })
    }
}


module.exports = {
    createWorkspace,
    editWorkspace,
    archiveWorkspace,
    getWorkspaces,
    deleteWorkspace,
    getWorkspace
}