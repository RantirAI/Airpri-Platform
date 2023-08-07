const Spreadsheet = require("../models/Spreadsheet")
const Workspace = require("../models/Workspace")


const createWorkspace = async (req, res) => {
    try {
        const { name, description, members = [], orgName = req.user?.orgs[0] } = req.body
        if (!name) {
            return res.status(400).json({ message: 'Name is required' })
        }

        const nameExists = await Workspace.findOne({ name, orgName })
        if (nameExists) {
            return res.status(400).json({ message: "Name is taken" })
        }

        const workspace = await Workspace.create({
            name,
            description,
            orgName,
            members: !(members.includes(String(req.user._id))) ? [...members, req.user._id] : members
        })

        res.status(201).json({ message: 'Workspace created', workspace })
    }
    catch (error) {
        console.log(error.message)
    res.sendStatus(500)
    }
}

const editWorkspace = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, members, orgName = [req.user?.orgs[0]] } = req.body

        const workspace = await Workspace.findOne({ _id: id, orgName, members: { $in: [req.user._id] } })

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
    res.sendStatus(500)
    }
}

const archiveWorkspace = async (req, res) => {
    try {
        const { id } = req.params

        const workspace = await Workspace.findOne({ _id: id, orgName: { $in: req.user.orgs }, members: { $in: [req.user._id] } })

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
    res.sendStatus(500)
    }
}

const getWorkspaces = async (req, res) => {
    try {
        const { archived } = req.query
        const workspacePromises = req.user.orgs.map(async (orgName) => {
            const workspaces = await Workspace.find({
                orgName,
                members: { $in: [req.user._id] }, archived: archived != undefined ? true : false
            }).populate('members');

            console.log(workspaces, 'helloooooo')

            if (workspaces.length > 0) {
                return {workspaces, orgName}
            }
        });

        const orgWorkspaces = await Promise.all(workspacePromises);

        res.status(200).json({ allWorkspaces: orgWorkspaces.filter((workspace) => workspace != null ) })

    } catch (error) {
        console.log(error.message)
    res.sendStatus(500)
    }
}

const deleteWorkspace = async (req, res) => {
    try {
        const { id } = req.params

        const workspace = await Workspace.findOne({ _id: id, orgName: { $in: req.user.orgs }, members: { $in: [req.user._id] } })

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' })
        }

        await workspace.deleteOne()

        res.status(200).json({ message: 'Workspace deleted successfully' })
    } catch (error) {
        console.log(error.message)
    res.sendStatus(500)
    }
}

const getWorkspace = async (req, res) => {
    try {
        const { id } = req.params
        const { archived } = req.query

        const workspace = await Workspace.findOne({ _id: id, orgName: { $in: req.user.orgs }, members: { $in: [req.user._id] }, archived: archived != undefined ? true : false })

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' })
        }

        const spreadsheets = await Spreadsheet.find({ workspace: id, archived: archived != undefined ? true : false })

        return res.status(200).json({ spreadsheets, workspace })
    } catch (error) {
        console.log(error.message)
    res.sendStatus(500)
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