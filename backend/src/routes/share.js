const { } = require('../controllers/auth')
const { shareWorkspace } = require('../controllers/share')
const authenticate = require('../middlewares/authenticate')
const validateObjectId = require('../middlewares/validateObjectId')

const router = require('express').Router()

router.use(authenticate)
router.post('/workspace/:id', shareWorkspace)

module.exports = router