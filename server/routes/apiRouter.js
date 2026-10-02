const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const marketRoutes = require('./marketRoutes');
const weatherRoutes = require('./weatherRoutes');
const authRoutes = require('./authRoutes');
const supportRoutes = require('./supportRoutes');

const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const messageRoutes = require('./messageRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const directoryRoutes = require('./directoryRoutes');
const savedProductRoutes = require('./savedProductRoutes');
const notificationRoutes = require('./notificationRoutes');
const profileRoutes = require('./profileRoutes');

// Base health check
router.get('/health', healthController.checkHealth);

// Domain routes
router.use('/auth', authRoutes);
router.use('/support', supportRoutes);
router.use('/market-prices', marketRoutes);
router.use('/weather', weatherRoutes);

// Phase 4 Domain Routes
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/messages', messageRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/directory', directoryRoutes);
router.use('/saved-products', savedProductRoutes);
router.use('/notifications', notificationRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
