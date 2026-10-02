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
    // Timeouts to prevent indefinite hangs on cloud environments
    connectionTimeout: 10000,   // 10s to establish connection
    greetingTimeout: 8000,      // 8s for SMTP greeting
    socketTimeout: 15000,       // 15s for socket inactivity
    tls: {
      rejectUnauthorized: false, // Allow cloud provider IPs (Render/Railway etc.)
    },
  });

  // Verify SMTP connection safely without exposing secrets
  transporter.verify((error) => {
    if (error) {
      console.error('[Mailer] SMTP verification failed:', error.message);
      isSmtpConfigured = false;
    } else {
      console.log('[Mailer] SMTP server ready to send emails');
    }
  });
} else {
  console.log('[Mailer] SMTP credentials not set. Running in simulator mode.');
}

module.exports = {
  transporter,
  isSmtpConfigured,
};
