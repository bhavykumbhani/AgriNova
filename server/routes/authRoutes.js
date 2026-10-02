const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');

// Rate limiter for sending OTP: max 5 requests per 10 minutes per IP
const sendOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many OTP requests from this connection. Please try again after a few minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for verifying OTP: max 15 verification attempts per 10 minutes per IP
const verifyOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many verification attempts. Please wait before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// SMTP OTP Endpoints
router.post('/send-email-otp', sendOtpLimiter, (req, res) => authController.sendEmailOtp(req, res));
router.post('/verify-email-otp', verifyOtpLimiter, (req, res) => authController.verifyEmailOtp(req, res));

// Verified Registration Endpoints
router.post('/register/farmer', (req, res) => authController.registerFarmer(req, res));
router.post('/register/buyer', (req, res) => authController.registerBuyer(req, res));

module.exports = router;
