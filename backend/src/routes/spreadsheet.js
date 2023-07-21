const {Router} = require('express')
const { createSpreadsheet, getSpreadsheet } = require('../controllers/spreadsheet')
const validateObjectId = require('../middlewares/validateObjectId')

const router = Router()

router.route('/').post(createSpreadsheet)
router.param("id", validateObjectId)
router.route('/:id').get(getSpreadsheet)

module.exports = router