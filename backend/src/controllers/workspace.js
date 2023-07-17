const Workspace = require("../models/Workspace")


const createWorkspace = async (req, res) => {
    try {
        const { name, description, members = [] } = req.body
        if (!name) {
            return res.status(400).json({ message: 'Name is required' })
        }

        const nameExists = await Workspace.findOne({ name })
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
        res.status(500).json({ message: 'Something went wrong' })
    }
}

const archiveWorkspace = async (req, res) => {
    try{
        const {id} =  req.params

        const workspace = await Workspace.findById(id)

        if(workspace.archived){
            return res.status(400).json({message: 'Workspace already archived'})
        }

        workspace.archived = true

        await workspace.save()

        res.status(200).json({message: 'Workspace archived successfully'})

    } catch(error) {
        console.log(error.message)
        res.status(500).json({message: 'Something went wrong'})
    }
}

module.exports = {
    createWorkspace,
    archiveWorkspace
}