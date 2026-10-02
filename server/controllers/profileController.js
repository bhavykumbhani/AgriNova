const { supabase, isConfigured } = require('../config/supabase');
const { success, error } = require('../utils/responseFormatter');

/**
 * Get full profile of current authenticated user
 */
const getCurrentProfile = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const { data: profile, error: fetchErr } = await supabase
      .from('profiles')
      .select('*, farmer_profiles(*), buyer_profiles(*)')
      .eq('auth_user_id', req.user.id)
      .single();

    if (fetchErr || !profile) {
      return error(res, 'Profile not found', 404);
    }

    return success(res, profile);
  } catch (err) {
    return error(res, 'Failed to fetch profile: ' + err.message, 500);
  }
};

/**
 * Update farmer profile
 */
const updateFarmerProfile = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const profileId = req.profile?.id;
    const farmerProfileId = req.farmerProfile?.id;

    if (!profileId || !farmerProfileId) {
      return error(res, 'Farmer profile not found', 404);
    }

    const {
      first_name,
      last_name,
      phone,
      avatar_url,
      preferred_language,
      farm_name,
      farm_location,
      farm_area,
      farm_area_unit,
      primary_crops,
      selling_categories,
    } = req.body;

    // 1. Update profiles table
    const profileUpdate = { updated_at: new Date().toISOString() };
    if (first_name !== undefined) profileUpdate.first_name = first_name.trim();
    if (last_name !== undefined) profileUpdate.last_name = last_name.trim();
    if (phone !== undefined) profileUpdate.phone = phone.trim();
    if (avatar_url !== undefined) profileUpdate.avatar_url = avatar_url;
    if (preferred_language !== undefined) profileUpdate.preferred_language = preferred_language;

    await supabase.from('profiles').update(profileUpdate).eq('id', profileId);

    // 2. Update farmer_profiles table
    const farmerUpdate = { updated_at: new Date().toISOString() };
    if (farm_name !== undefined) farmerUpdate.farm_name = farm_name.trim();
    if (farm_location !== undefined) farmerUpdate.farm_location = farm_location.trim();
    if (farm_area !== undefined) farmerUpdate.farm_area = Number(farm_area);
    if (farm_area_unit !== undefined) farmerUpdate.farm_area_unit = farm_area_unit;
    if (Array.isArray(primary_crops)) farmerUpdate.primary_crops = primary_crops;
    if (Array.isArray(selling_categories)) farmerUpdate.selling_categories = selling_categories;

    await supabase.from('farmer_profiles').update(farmerUpdate).eq('id', farmerProfileId);

    // Return updated profile
    const { data: updated } = await supabase
      .from('profiles')
      .select('*, farmer_profiles(*)')
      .eq('id', profileId)
      .single();

    return success(res, updated, 'Farmer profile updated successfully');
  } catch (err) {
    console.error('Error in updateFarmerProfile:', err);
    return error(res, 'Failed to update profile: ' + err.message, 500);
  }
};

/**
 * Update buyer profile
 */
const updateBuyerProfile = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const profileId = req.profile?.id;
    const buyerProfileId = req.buyerProfile?.id;

    if (!profileId || !buyerProfileId) {
      return error(res, 'Buyer profile not found', 404);
    }

    const {
      first_name,
      last_name,
      phone,
      avatar_url,
      preferred_language,
      company_name,
      business_type,
      city,
      state,
      business_address,
      gstin,
    } = req.body;

    // 1. Update profiles table
    const profileUpdate = { updated_at: new Date().toISOString() };
    if (first_name !== undefined) profileUpdate.first_name = first_name.trim();
    if (last_name !== undefined) profileUpdate.last_name = last_name.trim();
    if (phone !== undefined) profileUpdate.phone = phone.trim();
    if (avatar_url !== undefined) profileUpdate.avatar_url = avatar_url;
    if (preferred_language !== undefined) profileUpdate.preferred_language = preferred_language;

    await supabase.from('profiles').update(profileUpdate).eq('id', profileId);

    // 2. Update buyer_profiles table
    const buyerUpdate = { updated_at: new Date().toISOString() };
    if (company_name !== undefined) buyerUpdate.company_name = company_name.trim();
    if (business_type !== undefined) buyerUpdate.business_type = business_type;
    if (city !== undefined) buyerUpdate.city = city.trim();
    if (state !== undefined) buyerUpdate.state = state.trim();
    if (business_address !== undefined) buyerUpdate.business_address = business_address.trim();
    if (gstin !== undefined) buyerUpdate.gstin = gstin.trim();

    await supabase.from('buyer_profiles').update(buyerUpdate).eq('id', buyerProfileId);

    const { data: updated } = await supabase
      .from('profiles')
      .select('*, buyer_profiles(*)')
      .eq('id', profileId)
      .single();

    return success(res, updated, 'Buyer profile updated successfully');
  } catch (err) {
    console.error('Error in updateBuyerProfile:', err);
    return error(res, 'Failed to update profile: ' + err.message, 500);
  }
};

module.exports = {
  getCurrentProfile,
  updateFarmerProfile,
  updateBuyerProfile,
};
