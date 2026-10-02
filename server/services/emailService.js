const { transporter, isSmtpConfigured } = require('../config/mailer');
const env = require('../config/env');
const { otpEmailTemplate, otpTextTemplate } = require('../templates/otpEmailTemplate');

class EmailService {
  /**
   * Send 6-digit OTP verification email via SMTP
   */
  async sendOtpEmail({ to, firstName, otp }) {
    if (!to) {
      throw new Error('Recipient email address is required');
    }

    const subject = 'Your AgriNova Verification Code';
    const htmlContent = otpEmailTemplate({
      firstName,
      otp,
      expiryMinutes: env.OTP_EXPIRY_MINUTES,
    });
    const textContent = otpTextTemplate({
      firstName,
      otp,
      expiryMinutes: env.OTP_EXPIRY_MINUTES,
    });

    if (!isSmtpConfigured || !transporter) {
      console.log(`[EmailService Simulator] Simulated email sent to ${to} for ${firstName || 'User'}`);
      console.log(`[EmailService Simulator] (In production, email will be sent via ${env.EMAIL_HOST}:${env.EMAIL_PORT})`);
      return { success: true, simulated: true };
    }

    const mailOptions = {
      from: `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM_ADDRESS}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  }
}

module.exports = new EmailService();
