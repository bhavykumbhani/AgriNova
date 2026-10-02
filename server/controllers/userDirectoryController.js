const { supabase, isConfigured } = require('../config/supabase');
const { success, error } = require('../utils/responseFormatter');

/**
 * Get buyers for farmer's directory
 * Shows buyers who have active/completed orders with the farmer or are public verified buyers
 */
const getBuyersForFarmer = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const farmerProfileId = req.farmerProfile?.id;
    const { search, businessType, city } = req.query;

    let query = supabase
      .from('buyer_profiles')
      .select(`
        id,
        company_name,
        business_type,
        city,
        state,
        profile:profiles(id, first_name, last_name, email, avatar_url, created_at)
      `);

    if (businessType && businessType !== 'All') {
      query = query.eq('business_type', businessType);
    }

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (search) {
      query = query.or(`company_name.ilike.%${search}%,city.ilike.%${search}%`);
    }

    const { data: buyers, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;

    // Enrich with order counts specific to this farmer if available
    const enriched = await Promise.all((buyers || []).map(async (b) => {
      let completedOrders = 0;
      let activeOrders = 0;

      if (farmerProfileId) {
        const { count: compCount } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('farmer_profile_id', farmerProfileId)
          .eq('buyer_profile_id', b.id)
          .eq('status', 'Completed');

        const { count: actCount } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('farmer_profile_id', farmerProfileId)
          .eq('buyer_profile_id', b.id)
          .in('status', ['Pending', 'Confirmed', 'Processing', 'Shipped']);

        completedOrders = compCount || 0;
        activeOrders = actCount || 0;
      }

      return {
        ...b,
        completedOrders,
        activeOrders,
      };
    }));

    return success(res, enriched);
  } catch (err) {
    console.error('Error in getBuyersForFarmer:', err);
    return error(res, 'Failed to fetch buyers: ' + err.message, 500);
  }
};

/**
 * Get farmers directory for buyer
 */
const getFarmersForBuyer = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const { search, crop, location } = req.query;

    let query = supabase
      .from('farmer_profiles')
      .select(`
        id,
        farm_name,
        farm_location,
        farm_area,
        farm_area_unit,
        primary_crops,
        profile:profiles(id, first_name, last_name, avatar_url, created_at),
        products(id, crop_name, status, primary_image_url, price_per_quintal)
      `);

    if (location) {
      query = query.ilike('farm_location', `%${location}%`);
    }

    if (search) {
      query = query.or(`farm_name.ilike.%${search}%,farm_location.ilike.%${search}%`);
    }

    const { data: farmers, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;

    const formatted = (farmers || []).map(f => {
      const activeListings = (f.products || []).filter(p => p.status === 'Active').length;
      return {
        id: f.id,
        farm_name: f.farm_name,
        farm_location: f.farm_location,
        farm_area: f.farm_area,
        farm_area_unit: f.farm_area_unit,
        primary_crops: f.primary_crops,
        profile: f.profile,
        activeListings,
        products: (f.products || []).filter(p => p.status === 'Active').slice(0, 3),
      };
    });

    return success(res, formatted);
  } catch (err) {
    console.error('Error in getFarmersForBuyer:', err);
    return error(res, 'Failed to fetch farmers: ' + err.message, 500);
  }
};

module.exports = {
  getBuyersForFarmer,
  getFarmersForBuyer,
};
