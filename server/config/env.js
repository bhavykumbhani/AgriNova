const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Supabase Configuration
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',

  // SMTP Email Configuration
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
  EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
  EMAIL_USER: (process.env.EMAIL_USER || '').trim(),
  EMAIL_PASS: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''),
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'AgriNova',
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || 'no-reply@agrinova.in',

  // OTP Expiration & Cooldown Settings
  OTP_EXPIRY_MINUTES: Number(process.env.OTP_EXPIRY_MINUTES) || 10,
  OTP_RESEND_SECONDS: Number(process.env.OTP_RESEND_SECONDS) || 60,
};
