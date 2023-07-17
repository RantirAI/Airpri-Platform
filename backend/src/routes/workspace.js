const {Router} = require('express')
const { createWorkspace, archiveWorkspace } = require('../controllers/workspace')
const validateObjectId = require('../middlewares/validateObjectId')

const router = Router()

router.route('/').post(createWorkspace)
router.param("id", validateObjectId)
router.route('/:id').patch(archiveWorkspace)

module.exports = router