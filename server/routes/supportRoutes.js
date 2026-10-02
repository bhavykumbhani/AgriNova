const express = require('express');
const supportController = require('../controllers/supportController');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiter: 10 messages per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many messages sent from this IP. Please try again after a few minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/contact', contactLimiter, (req, res) => supportController.submitContact(req, res));

module.exports = router;
