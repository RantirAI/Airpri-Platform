const { createAccount, signIn, requestPasswordReset } = require('../controllers/auth')

const router = require('express').Router()

router.post('/create-account', createAccount)
router.post('/sign-in', signIn)
router.post('/request-password-reset', requestPasswordReset)

module.exports = router