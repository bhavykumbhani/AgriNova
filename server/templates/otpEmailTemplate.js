/**
 * AgriNova Modern Agri-Tech Responsive HTML Email Template for OTP Verification
 */

// Helper to sanitize user input for safe HTML insertion
const escapeHtml = (unsafe) => {
  if (!unsafe) return 'User';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Generate responsive HTML email
 */
const otpEmailTemplate = ({ firstName, otp, expiryMinutes = 10 }) => {
  const safeName = escapeHtml(firstName);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your AgriNova Verification Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F5F8F7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #10233F;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    img {
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        padding: 16px !important;
      }
      .card-content {
        padding: 24px 20px !important;
      }
      .otp-code {
        font-size: 32px !important;
        letter-spacing: 8px !important;
      }
    }
  </style>
</head>
<body style="background-color: #F5F8F7; margin: 0; padding: 24px 0;">
  <!-- Preheader text visible in email clients inbox snippet -->
  <div style="display: none; font-size: 1px; color: #F5F8F7; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Use your 6-digit AgriNova verification code to complete your registration.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F8F7; width: 100%;">
    <tr>
      <td align="center" style="padding: 20px 12px;">
        <table role="presentation" class="email-container" width="560" cellpadding="0" cellspacing="0" style="width: 560px; max-width: 560px;">
          
          <!-- Top Header / Brand Mark -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #149966, #087451); border-radius: 12px; line-height: 44px; text-align: center; color: #FFFFFF; font-size: 22px; font-weight: bold; margin: 0 auto 10px auto;">
                      🌾
                    </div>
                    <div style="font-size: 26px; font-weight: 800; color: #10233F; letter-spacing: -0.5px;">
                      Agri<span style="color: #149966;">Nova</span>
                    </div>
                    <div style="font-size: 12px; color: #5F6F7F; font-weight: 500; margin-top: 2px;">
                      Smart Agriculture Marketplace &amp; Decision Support System
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Email Card -->
          <tr>
            <td style="background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E3ECE7; box-shadow: 0 4px 20px rgba(16, 35, 63, 0.05); overflow: hidden;">
              <!-- Decorative Top Bar -->
              <div style="height: 6px; background: linear-gradient(90deg, #149966, #0E9F8A);"></div>

              <div class="card-content" style="padding: 36px 32px;">
                <div style="font-size: 22px; font-weight: 800; color: #10233F; margin-bottom: 8px;">
                  Verify Your Email
                </div>

                <div style="font-size: 15px; color: #10233F; margin-bottom: 16px; font-weight: 600;">
                  Hello ${safeName},
                </div>

                <p style="font-size: 14px; line-height: 1.6; color: #5F6F7F; margin: 0 0 24px 0;">
                  Welcome to <strong>AgriNova</strong>. Use the verification code below to verify your email address and continue creating your account.
                </p>

                <!-- Large Centered OTP Box -->
                <div style="background-color: #EAF8F2; border: 2px dashed #149966; border-radius: 16px; padding: 22px; text-align: center; margin: 24px 0;">
                  <div style="font-size: 11px; font-weight: 700; color: #087451; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                    Your Verification Code
                  </div>
                  <div class="otp-code" style="font-size: 38px; font-weight: 800; font-family: 'Courier New', Courier, monospace; letter-spacing: 10px; color: #149966; line-height: 1.1; margin-left: 10px;">
                    ${otp}
                  </div>
                  <div style="font-size: 12px; color: #087451; font-weight: 600; margin-top: 10px;">
                    Expires in ${expiryMinutes} minutes
                  </div>
                </div>

                <!-- Expiry and Security Warnings -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAF9; border-radius: 12px; border: 1px solid #E8EFEA; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 14px 16px;">
                      <p style="font-size: 12px; line-height: 1.5; color: #5F6F7F; margin: 0;">
                        🔒 <strong>Security Notice:</strong> For your security, never share this code with anyone. AgriNova representatives will <strong>never</strong> ask for your OTP by phone, chat, or message.
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 13px; line-height: 1.5; color: #7F8C8D; margin: 0;">
                  If you didn't request this verification code, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td align="center" style="padding: 24px 16px 8px 16px; font-size: 12px; color: #7F8C8D; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #10233F;">
                AgriNova
              </p>
              <p style="margin: 0 0 10px 0; color: #5F6F7F;">
                Smart Agriculture Marketplace &amp; Decision Support System
              </p>
              <p style="margin: 0 0 12px 0; color: #149966; font-weight: 600;">
                Connecting Farmers • Empowering Markets • Smarter Agriculture
              </p>
              <p style="margin: 0; font-size: 11px; color: #A0AAB5;">
                &copy; 2026 AgriNova. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * Generate plain text fallback email
 */
const otpTextTemplate = ({ firstName, otp, expiryMinutes = 10 }) => {
  const safeName = firstName || 'Farmer / Buyer';

  return `Hello ${safeName},

Welcome to AgriNova - Smart Agriculture Marketplace and Decision Support System.

Your 6-digit email verification code is:

${otp}

This code will expire in ${expiryMinutes} minutes.

SECURITY NOTICE:
For your security, never share this code with anyone. AgriNova will never ask you for your OTP by phone, chat, or message.

If you didn't request this verification code, you can safely ignore this email.

---
AgriNova
Connecting Farmers. Empowering Markets. Smarter Agriculture.
© 2026 AgriNova. All rights reserved.
`;
};

module.exports = {
  otpEmailTemplate,
  otpTextTemplate,
};
