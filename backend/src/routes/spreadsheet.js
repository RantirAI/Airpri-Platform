const { Router } = require('express')
const { createSpreadsheet, getSpreadsheet, updateSpreadsheet, deleteSpreadsheet } = require('../controllers/spreadsheet')
const validateObjectId = require('../middlewares/validateObjectId')
const authorizeSpreadsheetAccess = require('../middlewares/authorizeSpreadsheetAccess')

const router = Router()

router.route('/').post(createSpreadsheet)
router.param("id", validateObjectId)
router.param("id", authorizeSpreadsheetAccess)
router.route('/:id').get(getSpreadsheet).patch(updateSpreadsheet).delete(deleteSpreadsheet)

module.exports = router