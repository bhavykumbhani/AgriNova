import api from './api';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Service to register Farmer and Buyer accounts with backend verification and Supabase PostgreSQL.
 */
export const authService = {
  /**
   * Request 6-digit email OTP via backend SMTP service
   */
  sendEmailOtp: async (email, firstName = '') => {
    try {
      const response = await api.post('/auth/send-email-otp', {
        email: email.trim().toLowerCase(),
        firstName: firstName.trim(),
      });
      return response.data;
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      const code = err.response?.data?.code;
      const error = new Error(serverMessage);
      error.code = code;
      error.response = err.response;
      throw error;
    }
  },

  /**
   * Verify 6-digit email OTP via backend
   */
  verifyEmailOtp: async (email, otp) => {
    try {
      const response = await api.post('/auth/verify-email-otp', {
        email: email.trim().toLowerCase(),
        otp: String(otp).trim(),
      });
      return response.data;
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      const code = err.response?.data?.code;
      const error = new Error(serverMessage);
      error.code = code;
      error.response = err.response;
      throw error;
    }
  },

  /**
   * Register a new Farmer (verified on server)
   */
  registerFarmer: async ({
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
    typicalQuantity = null,
    preferredSellingUnit = 'quintal',
    preferredLanguage = 'en',
  }) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try backend registration endpoint which verifies OTP status
    try {
      const response = await api.post('/auth/register/farmer', {
        email: cleanEmail,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone,
        farmName: farmName.trim(),
        farmLocation,
        farmArea,
        farmAreaUnit,
        primaryCrops,
        sellingCategories,
        typicalQuantity,
        preferredSellingUnit,
        preferredLanguage,
      });

      if (response.data?.success) {
        return response.data.data;
      }
      throw new Error('Registration failed. Please try again.');
    } catch (apiErr) {
      if (apiErr.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        throw new Error('Email address has not been verified. Please verify with OTP.');
      }
      if (apiErr.response?.data?.message) {
        throw new Error(apiErr.response.data.message);
      }
      throw new Error(apiErr.message || 'Unable to connect to registration server.');
    }
  },

  /**
   * Register a new Buyer (verified on server)
   */
  registerBuyer: async ({
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
  }) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await api.post('/auth/register/buyer', {
        email: cleanEmail,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone,
        companyName: companyName.trim(),
        businessType,
        city: city.trim(),
        state: state.trim(),
        gstin: gstin.trim(),
        businessAddress: businessAddress.trim(),
        preferredLanguage,
      });

      if (response.data?.success) {
        return response.data.data;
      }
      throw new Error('Registration failed. Please try again.');
    } catch (apiErr) {
      if (apiErr.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        throw new Error('Email address has not been verified. Please verify with OTP.');
      }
      if (apiErr.response?.data?.message) {
        throw new Error(apiErr.response.data.message);
      }
      throw new Error(apiErr.message || 'Unable to connect to registration server.');
    }
  },
};

