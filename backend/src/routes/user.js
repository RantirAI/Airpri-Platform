const { getOrgMembers } = require('../controllers/user')
const authenticate = require('../middlewares/authenticate')

const {Router} = require('express')

const router = Router()

router.use(authenticate)

router.get('/org-members', getOrgMembers)

module.exports = router