const { createAccount, signIn, requestPasswordReset, resetPassword } = require('../controllers/auth')

const router = require('express').Router()

router.post('/create-account', createAccount)
router.post('/sign-in', signIn)
router.post('/request-password-reset', requestPasswordReset)
router.patch('/reset-password', resetPassword)

module.exports = router