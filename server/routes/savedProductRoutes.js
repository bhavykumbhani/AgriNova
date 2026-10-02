const express = require('express');
const router = express.Router();
const savedProductController = require('../controllers/savedProductController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.use(requireAuth, requireRole(['buyer']));

router.get('/', savedProductController.getSavedProducts);
router.post('/:productId', savedProductController.toggleSaveProduct);

module.exports = router;
