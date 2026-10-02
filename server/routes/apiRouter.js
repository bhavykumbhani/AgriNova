const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const marketRoutes = require('./marketRoutes');
const weatherRoutes = require('./weatherRoutes');
const authRoutes = require('./authRoutes');
const supportRoutes = require('./supportRoutes');

// Base health check
router.get('/health', healthController.checkHealth);

// Domain routes
router.use('/auth', authRoutes);
router.use('/support', supportRoutes);
router.use('/market-prices', marketRoutes);
router.use('/weather', weatherRoutes);

// Placeholder future route stubs ready for subsequent phases
router.all('/listings/*', (req, res) => {
  res.status(501).json({ success: false, message: 'Listings endpoint staged for Phase 3' });
});

module.exports = router;
