const User = require("../models/User")

const getOrgMembers = async (req, res) => {
    try {
        const members = await User.find({ orgName: req.user.orgName })

        if (!members) {
            return res.status(404).json({ message: 'No member found' })
        }

        res.status(200).json({ members })

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

module.exports = {
    getOrgMembers
}