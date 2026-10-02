const express = require('express');
const router = express.Router();
const userDirectoryController = require('../controllers/userDirectoryController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/buyers', requireAuth, requireRole(['farmer', 'admin']), userDirectoryController.getBuyersForFarmer);
router.get('/farmers', requireAuth, userDirectoryController.getFarmersForBuyer);

module.exports = router;
