const crypto = require('crypto');
const { supabase, isConfigured } = require('../config/supabase');
const env = require('../config/env');

// In-memory fallback repository when Supabase is running in offline/simulator mode
const inMemoryOtpStore = new Map();

class OtpService {
  /**
   * Securely hash OTP with email salt using SHA-256
   */
  hashOtp(otp, email) {
    return crypto
      .createHash('sha256')
      .update(`${email.toLowerCase().trim()}:${otp}:agrinova_salt_2026`)
      .digest('hex');
  }

  /**
   * Generate cryptographically secure 6-digit OTP string
   */
  generateSecureOtp() {
    return crypto.randomInt(100000, 1000000).toString();
  }

  /**
   * Create and store a new hashed OTP with cooldown and expiration
   */
  async createOtp(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const now = new Date();

    // 1. Check Resend Cooldown
    const existing = await this.getLatestOtp(normalizedEmail);
    if (existing && !existing.verified) {
      const createdAt = new Date(existing.created_at);
      const secondsSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

      if (secondsSinceCreation < env.OTP_RESEND_SECONDS) {
        const remainingSeconds = env.OTP_RESEND_SECONDS - secondsSinceCreation;
        const err = new Error(`Please wait ${remainingSeconds} seconds before requesting a new code.`);
        err.code = 'OTP_COOLDOWN';
        err.remainingSeconds = remainingSeconds;
        throw err;
      }
    }

    // 2. Invalidate previous active OTPs for this email
    await this.invalidatePreviousOtps(normalizedEmail);

    // 3. Generate raw 6-digit OTP and calculate hash
    const rawOtp = this.generateSecureOtp();
    const otpHash = this.hashOtp(rawOtp, normalizedEmail);
    const expiresAt = new Date(now.getTime() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

    // 4. Store in database / in-memory store
    if (isConfigured && supabase) {
      try {
        const { error } = await supabase.from('email_verification_otps').insert({
          email: normalizedEmail,
          otp_hash: otpHash,
          expires_at: expiresAt.toISOString(),
          verified: false,
          attempt_count: 0,
          created_at: now.toISOString(),
          updated_at: now.toISOString(),
        });

        if (!error) {
          // Cleanup older expired records in background
          this.cleanupExpiredOtps().catch(() => {});
          return rawOtp;
        }
      } catch (dbErr) {
        console.warn('[OtpService] Supabase insert notice:', dbErr.message);
      }
    }

    // Fallback store
    inMemoryOtpStore.set(normalizedEmail, {
      email: normalizedEmail,
      otp_hash: otpHash,
      expires_at: expiresAt,
      verified: false,
      attempt_count: 0,
      created_at: now,
      updated_at: now,
    });

    return rawOtp;
  }

  /**
   * Verify provided OTP against stored hash
   */
  async verifyOtp(email, enteredOtp) {
    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = String(enteredOtp).trim();

    if (!cleanOtp || cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      const err = new Error('Invalid verification code format. Must be 6 digits.');
      err.code = 'INVALID_FORMAT';
      throw err;
    }

    const record = await this.getLatestOtp(normalizedEmail);

    if (!record) {
      const err = new Error('No active verification code found for this email. Please request a new code.');
      err.code = 'OTP_NOT_FOUND';
      throw err;
    }

    // Check if already verified
    if (record.verified) {
      return { verified: true, message: 'Email is already verified.' };
    }

    const now = new Date();
    const expiresAt = new Date(record.expires_at);

    // Check expiration
    if (now > expiresAt) {
      await this.invalidatePreviousOtps(normalizedEmail);
      const err = new Error('This verification code has expired. Please request a new one.');
      err.code = 'OTP_EXPIRED';
      throw err;
    }

    // Check attempt limit (max 5)
    const attempts = (record.attempt_count || 0) + 1;
    if (attempts > 5) {
      await this.invalidatePreviousOtps(normalizedEmail);
      const err = new Error('Too many incorrect attempts. Please request a new verification code.');
      err.code = 'TOO_MANY_ATTEMPTS';
      throw err;
    }

    // Verify hash
    const expectedHash = this.hashOtp(cleanOtp, normalizedEmail);
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(record.otp_hash, 'utf8'),
      Buffer.from(expectedHash, 'utf8')
    );

    if (!isMatch) {
      await this.incrementAttemptCount(normalizedEmail, attempts, record.id);
      const remainingAttempts = 5 - attempts;
      const err = new Error(
        remainingAttempts > 0
          ? `Invalid verification code. ${remainingAttempts} attempt(s) remaining.`
          : 'Too many incorrect attempts. Please request a new verification code.'
      );
      err.code = 'INVALID_OTP';
      err.remainingAttempts = remainingAttempts;
      throw err;
    }

    // Mark as verified
    await this.markAsVerified(normalizedEmail, record.id);

    return {
      verified: true,
      message: 'Email verified successfully.',
    };
  }

  /**
   * Check if email has an active verified record
   */
  async isEmailVerified(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const record = await this.getLatestOtp(normalizedEmail);
    return Boolean(record && record.verified);
  }

  // --- Internal Helper Operations ---

  async getLatestOtp(email) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('email_verification_otps')
          .select('*')
          .eq('email', email)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) return data;
      } catch (err) {
        // Fallback
      }
    }
    return inMemoryOtpStore.get(email) || null;
  }

  async invalidatePreviousOtps(email) {
    if (isConfigured && supabase) {
      try {
        await supabase
          .from('email_verification_otps')
          .delete()
          .eq('email', email)
          .eq('verified', false);
      } catch (err) {
        // ignore
      }
    }
    const mem = inMemoryOtpStore.get(email);
    if (mem && !mem.verified) {
      inMemoryOtpStore.delete(email);
    }
  }

  async incrementAttemptCount(email, attempts, recordId) {
    if (isConfigured && supabase && recordId) {
      try {
        await supabase
          .from('email_verification_otps')
          .update({
            attempt_count: attempts,
            updated_at: new Date().toISOString(),
          })
          .eq('id', recordId);
      } catch (err) {
        // ignore
      }
    }
    const mem = inMemoryOtpStore.get(email);
    if (mem) {
      mem.attempt_count = attempts;
      mem.updated_at = new Date();
    }
  }

  async markAsVerified(email, recordId) {
    const now = new Date();
    if (isConfigured && supabase && recordId) {
      try {
        await supabase
          .from('email_verification_otps')
          .update({
            verified: true,
            updated_at: now.toISOString(),
          })
          .eq('id', recordId);
      } catch (err) {
        // ignore
      }
    }
    const mem = inMemoryOtpStore.get(email);
    if (mem) {
      mem.verified = true;
      mem.updated_at = now;
    }
  }

  async cleanupExpiredOtps() {
    const now = new Date().toISOString();
    if (isConfigured && supabase) {
      await supabase
        .from('email_verification_otps')
        .delete()
        .lt('expires_at', now)
        .eq('verified', false);
    }
  }
}

module.exports = new OtpService();
