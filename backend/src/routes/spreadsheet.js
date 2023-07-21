const {Router} = require('express')
const { createSpreadsheet } = require('../controllers/spreadsheet')

const router = Router()

router.route('/').post(createSpreadsheet)

module.exports = router