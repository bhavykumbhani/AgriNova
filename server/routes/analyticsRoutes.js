const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/farmer', requireRole(['farmer']), analyticsController.getFarmerAnalytics);
router.get('/buyer', requireRole(['buyer']), analyticsController.getBuyerAnalytics);

module.exports = router;
