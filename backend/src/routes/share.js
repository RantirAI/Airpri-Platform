const { } = require('../controllers/auth')
const { shareWorkspace, shareSpreadsheet, getSpreadsheet, getWorkspace } = require('../controllers/share')
const authenticate = require('../middlewares/authenticate')

const router = require('express').Router()

router.get('/workspace/:id', getWorkspace)
router.get('/spreadsheet/:id', getSpreadsheet)

router.use(authenticate)
router.post('/workspace/:id', shareWorkspace)
router.post('/spreadsheet/:id', shareSpreadsheet)

module.exports = router