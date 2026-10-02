const otpService = require('../services/otpService');
const emailService = require('../services/emailService');
const { success, error } = require('../utils/responseFormatter');
const { supabase, isConfigured } = require('../config/supabase');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Controller handling SMTP Email OTP and Verified Registration
 */
class AuthController {
  /**
   * POST /api/auth/send-email-otp
   */
  async sendEmailOtp(req, res) {
    try {
      const { email, firstName } = req.body;

      if (!email || !emailRegex.test(email.trim())) {
        return error(res, 'Please provide a valid email address.', 400);
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanFirstName = firstName ? String(firstName).trim() : 'Grower / Buyer';

      // 1. Generate & hash OTP with cooldown/expiration
      const rawOtp = await otpService.createOtp(cleanEmail);

      // 2. Dispatch email via Nodemailer SMTP with responsive template
      await emailService.sendOtpEmail({
        to: cleanEmail,
        firstName: cleanFirstName,
        otp: rawOtp,
      });

      // 3. Return safe success response
      return success(res, null, 'Verification code sent successfully.', 200, {
        maskedEmail: maskEmail(cleanEmail),
      });
    } catch (err) {
      if (err.code === 'OTP_COOLDOWN') {
        return error(res, 'Please wait before requesting another verification code.', 429, {
          code: 'OTP_COOLDOWN',
          remainingSeconds: err.remainingSeconds,
        });
      }
      console.error('[sendEmailOtp Error]:', err.message);
      return error(res, err.message || "We couldn't send the verification code. Please try again.", 500);
    }
  }

  /**
   * POST /api/auth/verify-email-otp
   */
  async verifyEmailOtp(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !emailRegex.test(email.trim())) {
        return error(res, 'Enter a valid email address.', 400);
      }

      if (!otp || String(otp).trim().length !== 6) {
        return error(res, 'Invalid verification code.', 400, { code: 'INVALID_OTP' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const result = await otpService.verifyOtp(cleanEmail, String(otp).trim());

      return success(res, null, 'Email verified successfully.', 200, {
        verified: true,
      });
    } catch (err) {
      console.warn('[verifyEmailOtp Warning]:', err.message);
      if (err.code === 'OTP_EXPIRED') {
        return error(res, 'This verification code has expired. Please request a new one.', 400, {
          code: 'OTP_EXPIRED',
        });
      }
      if (err.code === 'TOO_MANY_ATTEMPTS') {
        return error(res, 'Too many incorrect attempts. Please request a new verification code.', 429, {
          code: 'TOO_MANY_ATTEMPTS',
        });
      }
      if (err.code === 'INVALID_OTP') {
        return error(res, 'Invalid verification code.', 400, {
          code: 'INVALID_OTP',
          remainingAttempts: err.remainingAttempts,
        });
      }
      return error(res, err.message || 'Invalid verification code.', 400, {
        code: err.code || 'VERIFICATION_ERROR',
      });
    }
  }

  /**
   * POST /api/auth/register/farmer
   * Enforces server-side email verification before account creation
   */
  async registerFarmer(req, res) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
        farmName,
        farmLocation,
        farmArea,
        farmAreaUnit,
        primaryCrops = [],
        sellingCategories = [],
        typicalQuantity,
        preferredSellingUnit = 'quintal',
        preferredLanguage = 'en',
      } = req.body;

      if (!email || !emailRegex.test(email)) {
        return error(res, 'A valid email address is required.', 400);
      }

      const cleanEmail = email.trim().toLowerCase();

      // Enforce email verification status on backend
      const isVerified = await otpService.isEmailVerified(cleanEmail);
      if (!isVerified) {
        return error(
          res,
          'Email address has not been verified. Please complete OTP verification first.',
          403,
          { code: 'EMAIL_NOT_VERIFIED' }
        );
      }

      if (!firstName || !lastName || !password || password.length < 8) {
        return error(res, 'Please complete all required fields and ensure password is at least 8 characters.', 400);
      }

      let authUser = null;
      let profileRecord = null;

      if (isConfigured && supabase) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { role: 'farmer', first_name: firstName, last_name: lastName, phone },
          },
        });

        if (authError) throw authError;
        authUser = authData.user;

        if (authUser) {
          const { data: prof, error: profErr } = await supabase
            .from('profiles')
            .insert({
              auth_user_id: authUser.id,
              role: 'farmer',
              first_name: firstName,
              last_name: lastName,
              email: cleanEmail,
              phone,
              preferred_language: preferredLanguage,
            })
            .select()
            .single();

          if (profErr) console.warn('[registerFarmer] Profile insert notice:', profErr.message);
          profileRecord = prof;

          const profileId = prof ? prof.id : authUser.id;

          const { data: farmerProf } = await supabase
            .from('farmer_profiles')
            .insert({
              profile_id: profileId,
              farm_name: farmName,
              farm_area: farmArea ? parseFloat(farmArea) : null,
              farm_area_unit: farmAreaUnit || 'Acre',
              latitude: farmLocation?.latitude || null,
              longitude: farmLocation?.longitude || null,
              city: farmLocation?.city || '',
              state: farmLocation?.state || '',
              country: farmLocation?.country || 'India',
              formatted_address: farmLocation?.formatted_address || '',
              selling_categories: sellingCategories,
              typical_quantity: typicalQuantity ? parseFloat(typicalQuantity) : null,
              preferred_selling_unit: preferredSellingUnit,
            })
            .select()
            .single();

          if (farmerProf && primaryCrops.length > 0) {
            const cropRecords = primaryCrops.map((c) => ({
              farmer_profile_id: farmerProf.id,
              crop_name: c,
            }));
            await supabase.from('farmer_crops').insert(cropRecords);
          }
        }
      } else {
        // Development simulation mode
        authUser = {
          id: `sim_usr_${Date.now()}`,
          email: cleanEmail,
          user_metadata: { role: 'farmer', first_name: firstName, last_name: lastName },
        };
        profileRecord = {
          id: `sim_prof_${Date.now()}`,
          auth_user_id: authUser.id,
          role: 'farmer',
          first_name: firstName,
          last_name: lastName,
          email: cleanEmail,
          phone,
          farm_name: farmName,
        };
      }

      return success(res, { user: authUser, profile: profileRecord }, 'Farmer account created successfully.', 201);
    } catch (err) {
      console.error('[registerFarmer Error]:', err.message);
      return error(res, err.message || 'Registration failed.', 500);
    }
  }

  /**
   * POST /api/auth/register/buyer
   * Enforces server-side email verification before account creation
   */
  async registerBuyer(req, res) {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
        companyName,
        businessType,
        city,
        state = '',
        gstin = '',
        businessAddress = '',
        preferredLanguage = 'en',
      } = req.body;

      if (!email || !emailRegex.test(email)) {
        return error(res, 'A valid email address is required.', 400);
      }

      const cleanEmail = email.trim().toLowerCase();

      // Enforce email verification status on backend
      const isVerified = await otpService.isEmailVerified(cleanEmail);
      if (!isVerified) {
        return error(
          res,
          'Email address has not been verified. Please complete OTP verification first.',
          403,
          { code: 'EMAIL_NOT_VERIFIED' }
        );
      }

      if (!companyName || !businessType || !city || !password || password.length < 8) {
        return error(res, 'Please provide all required business details and a valid password.', 400);
      }

      let authUser = null;
      let profileRecord = null;

      if (isConfigured && supabase) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { role: 'buyer', first_name: firstName, last_name: lastName, phone },
          },
        });

        if (authError) throw authError;
        authUser = authData.user;

        if (authUser) {
          const { data: prof, error: profErr } = await supabase
            .from('profiles')
            .insert({
              auth_user_id: authUser.id,
              role: 'buyer',
              first_name: firstName,
              last_name: lastName,
              email: cleanEmail,
              phone,
              preferred_language: preferredLanguage,
            })
            .select()
            .single();

          if (profErr) console.warn('[registerBuyer] Profile insert notice:', profErr.message);
          profileRecord = prof;

          const profileId = prof ? prof.id : authUser.id;

          await supabase.from('buyer_profiles').insert({
            profile_id: profileId,
            company_name: companyName,
            business_type: businessType,
            city,
            state,
            country: 'India',
            gstin: gstin ? gstin.toUpperCase() : null,
            business_address: businessAddress,
          });
        }
      } else {
        // Development simulation mode
        authUser = {
          id: `sim_usr_${Date.now()}`,
          email: cleanEmail,
          user_metadata: { role: 'buyer', first_name: firstName, last_name: lastName },
        };
        profileRecord = {
          id: `sim_prof_${Date.now()}`,
          auth_user_id: authUser.id,
          role: 'buyer',
          first_name: firstName,
          last_name: lastName,
          email: cleanEmail,
          phone,
          company_name: companyName,
        };
      }

      return success(res, { user: authUser, profile: profileRecord }, 'Buyer account created successfully.', 201);
    } catch (err) {
      console.error('[registerBuyer Error]:', err.message);
      return error(res, err.message || 'Registration failed.', 500);
    }
  }
}

// Utility to mask email for safe display e.g. dar****@gmail.com
function maskEmail(email) {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 3) {
    return `${user[0]}***@${domain}`;
  }
  const visible = user.slice(0, 3);
  return `${visible}****@${domain}`;
}

module.exports = new AuthController();
