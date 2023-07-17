const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authenticate = async (req, res, next) => {
    try {
        if (!req.headers?.authorization) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const token = req.headers?.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const decodedUser = jwt.decode(token, process.env.JWT_SECRET)

        if (!decodedUser) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const user = await User.findOne({ _id: decodedUser._id })
        
        if(!user){
            return res.status(401).json({message: "Unauthorized fdfsdffds"})
        }

        req.user = user

        next()
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Unable to authenticate user' })
    }

}

module.exports = authenticate