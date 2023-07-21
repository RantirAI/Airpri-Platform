const { Router } = require('express')
const { createSpreadsheet, getSpreadsheet, updateSpreadsheet, deleteSpreadsheet, archiveSpreadsheet } = require('../controllers/spreadsheet')
const validateObjectId = require('../middlewares/validateObjectId')
const authorizeSpreadsheetAccess = require('../middlewares/authorizeSpreadsheetAccess')

const router = Router()

router.route('/').post(createSpreadsheet)
router.param("id", validateObjectId)
router.param("id", authorizeSpreadsheetAccess)
router.route('/:id').get(getSpreadsheet).put(updateSpreadsheet).delete(deleteSpreadsheet).patch(archiveSpreadsheet)

module.exports = router