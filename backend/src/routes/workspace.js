const {Router} = require('express')
const { createWorkspace } = require('../controllers/workspace')

const router = Router()

router.route('/').post(createWorkspace)

module.exports = router