const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/', marketController.getMarketPrices);
router.get('/:cropId', marketController.getPriceById);

module.exports = router;
