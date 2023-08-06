const {Router} = require('express')
const { createWorkspace, archiveWorkspace, getWorkspaces, deleteWorkspace, editWorkspace, getWorkspace } = require('../controllers/workspace')
const validateObjectId = require('../middlewares/validateObjectId')

const router = Router()

router.route('/').post(createWorkspace).get(getWorkspaces)
router.param("id", validateObjectId)
router.route('/:id').patch(archiveWorkspace).delete(deleteWorkspace).put(editWorkspace).get(getWorkspace)

module.exports = router