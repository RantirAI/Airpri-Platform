const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const createAccount = async (req, res) => {
  try {
    const { email, password, orgName, termsAndConditionsAgreed} = req.body

    if (!(orgName?.trim())) {
      return res.status(400).json({ message: 'Organization name is required' })
    }

    if (!(email?.trim())) {
      return res.status(400).json({ message: 'Email is required' })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email' })
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password should be atleast 6 characters long' })
    }

    if (!termsAndConditionsAgreed || !(JSON.parse(termsAndConditionsAgreed))) {
      return res.status(400).json({ message: 'Terms and conditions must be agreed' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User exists' })
    }

    const user = await User.create({ email, password : hashedPassword, orgName} )

    const token = jwt.sign({ email, orgName} , process.env.JWT_SECRET)

    res.status(201).json({ message: 'Account created successfully', token })

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!(email?.trim())) {
      return res.status(400).json({ message: 'Email is required' })
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ user: user.email, orgName: user.orgName} , process.env.JWT_SECRET)

    res.status(200).json({ token })

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

module.exports = {
  createAccount,
  signIn,
}