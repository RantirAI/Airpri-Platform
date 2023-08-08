const { Router } = require('express')
const multer = require('multer');
const { createSpreadsheet, getSpreadsheet, updateSpreadsheet, deleteSpreadsheet, archiveSpreadsheet, importCsv } = require('../controllers/spreadsheet')
const validateObjectId = require('../middlewares/validateObjectId')
const authorizeSpreadsheetAccess = require('../middlewares/authorizeSpreadsheetAccess')
const upload = multer();

const router = Router()

router.route('/').post(createSpreadsheet)
router.param("id", validateObjectId)
router.param("id", authorizeSpreadsheetAccess)
router.route('/import-csv').post(upload.single('csvFile'),importCsv);
router.route('/:id').get(getSpreadsheet).put(updateSpreadsheet).delete(deleteSpreadsheet).patch(archiveSpreadsheet)

module.exports = router