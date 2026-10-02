const nodemailer = require('nodemailer');
const env = require('./env');

let transporter = null;
let isSmtpConfigured = Boolean(env.EMAIL_USER && env.EMAIL_PASS);

if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_SECURE,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: true, // Keep certificate verification enabled
    },
  });

  // Verify SMTP connection safely without exposing secrets
  transporter.verify((error) => {
    if (error) {
      console.error('SMTP configuration failed');
    } else {
      console.log('SMTP server ready');
    }
  });
} else {
  console.log('[Mailer] SMTP credentials not set in .env. Falling back to development simulator mode.');
}

module.exports = {
  transporter,
  isSmtpConfigured,
};
