const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Order endpoints (require auth)
router.use(requireAuth);

router.get('/farmer', requireRole(['farmer']), orderController.getFarmerOrders);
router.get('/buyer', requireRole(['buyer']), orderController.getBuyerOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', requireRole(['buyer']), orderController.createOrder);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
