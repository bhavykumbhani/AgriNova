const { supabase, isConfigured } = require('../config/supabase');
const { success, error } = require('../utils/responseFormatter');

/**
 * Get all saved products for buyer
 */
const getSavedProducts = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const buyerProfileId = req.buyerProfile?.id;
    if (!buyerProfileId) return error(res, 'Buyer profile not found', 404);

    const { data: saved, error: fetchErr } = await supabase
      .from('saved_products')
      .select(`
        id,
        created_at,
        product:products(
          *,
          farmer:farmer_profiles(id, farm_name, farm_location, profile:profiles(first_name, last_name))
        )
      `)
      .eq('buyer_profile_id', buyerProfileId)
      .order('created_at', { ascending: false });

    if (fetchErr) throw fetchErr;

    // Filter out deleted products
    const valid = (saved || []).filter(s => s.product && !s.product.deleted_at);

    return success(res, valid);
  } catch (err) {
    return error(res, 'Failed to fetch saved products: ' + err.message, 500);
  }
};

/**
 * Toggle save/unsave a product
 */
const toggleSaveProduct = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const buyerProfileId = req.buyerProfile?.id;
    if (!buyerProfileId) return error(res, 'Buyer profile not found', 404);

    const { productId } = req.params;

    // Check if already saved
    const { data: existing, error: findErr } = await supabase
      .from('saved_products')
      .select('id')
      .eq('buyer_profile_id', buyerProfileId)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      // Unsave
      await supabase.from('saved_products').delete().eq('id', existing.id);
      return success(res, { isSaved: false }, 'Product removed from saved items');
    } else {
      // Save
      const { data: newSave, error: insertErr } = await supabase
        .from('saved_products')
        .insert({
          buyer_profile_id: buyerProfileId,
          product_id: productId,
        })
        .select()
        .single();

      if (insertErr) throw insertErr;
      return success(res, { isSaved: true, savedItem: newSave }, 'Product saved successfully');
    }
  } catch (err) {
    return error(res, 'Failed to toggle save status: ' + err.message, 500);
  }
};

module.exports = {
  getSavedProducts,
  toggleSaveProduct,
};
