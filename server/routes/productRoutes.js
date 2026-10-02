const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// Public / Buyer marketplace listings
router.get('/', productController.getPublicProducts);

// Farmer's own listings
router.get('/farmer', requireAuth, requireRole(['farmer']), productController.getFarmerProducts);

// Single product details
router.get('/:id', productController.getProductById);

// Farmer Product Management
router.post('/', requireAuth, requireRole(['farmer']), productController.createProduct);
router.put('/:id', requireAuth, requireRole(['farmer']), productController.updateProduct);
router.delete('/:id', requireAuth, requireRole(['farmer']), productController.deleteProduct);

module.exports = router;
