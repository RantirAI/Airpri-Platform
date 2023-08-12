const { Router } = require('express')
const multer = require('multer');
const { createSpreadsheet, getSpreadsheet, updateSpreadsheet, deleteSpreadsheet, archiveSpreadsheet, importCsv, autosave } = require('../controllers/spreadsheet')
const validateObjectId = require('../middlewares/validateObjectId')
const authorizeSpreadsheetAccess = require('../middlewares/authorizeSpreadsheetAccess')
const upload = multer();

const router = Router()

router.route('/').post(createSpreadsheet)
router.param("id", validateObjectId)
router.param("id", authorizeSpreadsheetAccess)
router.route('/import-csv/:id').post(upload.single('csvFile'),importCsv);
router.route('/autosave/:id').patch(autosave);
router.route('/:id').get(getSpreadsheet).put(updateSpreadsheet).delete(deleteSpreadsheet).patch(archiveSpreadsheet)

module.exports = router