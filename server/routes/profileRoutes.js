const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/me', profileController.getCurrentProfile);
router.put('/farmer', requireRole(['farmer']), profileController.updateFarmerProfile);
router.put('/buyer', requireRole(['buyer']), profileController.updateBuyerProfile);

module.exports = router;
