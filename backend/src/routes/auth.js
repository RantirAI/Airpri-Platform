const { createAccount, signIn } = require('../controllers/auth')

const router = require('express').Router()

router.post('/create-account', createAccount)
router.post('/sign-in', signIn)

module.exports = router