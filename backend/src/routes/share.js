const { } = require('../controllers/auth')
const { shareWorkspace, shareSpreadsheet } = require('../controllers/share')
const authenticate = require('../middlewares/authenticate')
const authorizeSpreadsheetAccess = require('../middlewares/authorizeSpreadsheetAccess')
const validateObjectId = require('../middlewares/validateObjectId')

const router = require('express').Router()

router.use(authenticate)
router.post('/workspace/:id', shareWorkspace)
router.post('/spreadsheet/:id', shareSpreadsheet)

module.exports = router