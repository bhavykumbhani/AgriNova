const { supabase, isConfigured } = require('../config/supabase');
const { success, error } = require('../utils/responseFormatter');

/**
 * Get active marketplace products with search and filtering
 */
const getPublicProducts = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const {
      search,
      category,
      crop,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    let query = supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        farmer:farmer_profiles(
          id,
          farm_name,
          farm_location,
          profile:profiles(id, first_name, last_name, email, phone, avatar_url)
        )
      `, { count: 'exact' })
      .eq('status', 'Active')
      .is('deleted_at', null);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (crop) {
      query = query.ilike('crop_name', `%${crop}%`);
    }

    if (search) {
      query = query.or(`crop_name.ilike.%${search}%,description.ilike.%${search}%,city.ilike.%${search}%,state.ilike.%${search}%`);
    }

    if (minPrice) {
      query = query.gte('price_per_quintal', Number(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price_per_quintal', Number(maxPrice));
    }

    // Sorting
    if (sort === 'price_asc') {
      query = query.order('price_per_quintal', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price_per_quintal', { ascending: false });
    } else if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const from = (pageNum - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to);

    const { data: products, count, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;

    return success(res, {
      products: products || [],
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    }, 'Products retrieved successfully');
  } catch (err) {
    console.error('Error fetching public products:', err);
    return error(res, 'Failed to fetch products: ' + err.message, 500);
  }
};

/**
 * Get products owned by the authenticated farmer
 */
const getFarmerProducts = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const farmerProfileId = req.farmerProfile?.id;
    if (!farmerProfileId) {
      return error(res, 'Farmer profile not found', 404);
    }

    const { search, category, status, sort = 'newest', page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('products')
      .select('*, images:product_images(*)', { count: 'exact' })
      .eq('farmer_profile_id', farmerProfileId)
      .is('deleted_at', null);

    if (status && status !== 'All') {
      query = query.eq('status', status);
    }

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`crop_name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (sort === 'price_asc') {
      query = query.order('price_per_quintal', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price_per_quintal', { ascending: false });
    } else if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const from = (pageNum - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to);

    const { data: products, count, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;

    return success(res, {
      products: products || [],
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (err) {
    console.error('Error in getFarmerProducts:', err);
    return error(res, 'Failed to fetch farmer products: ' + err.message, 500);
  }
};

/**
 * Get product by ID
 */
const getProductById = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const { id } = req.params;
    const { data: product, error: fetchErr } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        farmer:farmer_profiles(
          id,
          farm_name,
          farm_location,
          farm_area,
          farm_area_unit,
          profile:profiles(id, first_name, last_name, email, phone, avatar_url, created_at)
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchErr || !product) {
      return error(res, 'Product not found', 404);
    }

    return success(res, product);
  } catch (err) {
    return error(res, 'Failed to fetch product details: ' + err.message, 500);
  }
};

/**
 * Create a new product listing
 */
const createProduct = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const farmerProfileId = req.farmerProfile?.id;
    if (!farmerProfileId) {
      return error(res, 'Farmer profile not found for this account', 403);
    }

    const {
      crop_name,
      category,
      description = '',
      quantity_available,
      quantity_unit = 'quintal',
      price_per_quintal,
      harvest_date,
      available_from,
      quality_grade,
      latitude,
      longitude,
      city,
      state,
      status = 'Active',
      images = [], // Array of { image_url, storage_path, is_primary }
    } = req.body;

    if (!crop_name || !category || quantity_available === undefined || price_per_quintal === undefined) {
      return error(res, 'Please provide all required fields: Crop Name, Category, Quantity, Price.', 400);
    }

    const numQuantity = Number(quantity_available);
    const numPrice = Number(price_per_quintal);

    if (isNaN(numQuantity) || numQuantity <= 0) {
      return error(res, 'Quantity must be a positive number.', 400);
    }

    if (isNaN(numPrice) || numPrice <= 0) {
      return error(res, 'Price per quintal must be a positive number.', 400);
    }

    // Determine primary image
    const primaryImg = images.find(img => img.is_primary)?.image_url || images[0]?.image_url || null;

    // 1. Insert product
    const { data: product, error: insertErr } = await supabase
      .from('products')
      .insert({
        farmer_profile_id: farmerProfileId,
        crop_name: crop_name.trim(),
        category,
        description: description ? description.trim() : null,
        quantity_available: numQuantity,
        quantity_unit,
        price_per_quintal: numPrice,
        harvest_date: harvest_date || null,
        available_from: available_from || null,
        quality_grade: quality_grade || null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        city: city ? city.trim() : null,
        state: state ? state.trim() : null,
        status,
        primary_image_url: primaryImg,
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    // 2. Insert product images if any
    if (images && images.length > 0) {
      const imageRows = images.map((img, idx) => ({
        product_id: product.id,
        image_url: img.image_url,
        storage_path: img.storage_path || null,
        is_primary: idx === 0 || Boolean(img.is_primary),
        display_order: idx,
      }));

      const { error: imgErr } = await supabase.from('product_images').insert(imageRows);
      if (imgErr) console.error('Error inserting product images:', imgErr);
    }

    // Return product with images
    const { data: fullProduct } = await supabase
      .from('products')
      .select('*, images:product_images(*)')
      .eq('id', product.id)
      .single();

    return success(res, fullProduct || product, 'Product published successfully', 201);
  } catch (err) {
    console.error('Error creating product:', err);
    return error(res, 'Failed to create product: ' + err.message, 500);
  }
};

/**
 * Update an existing product
 */
const updateProduct = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const farmerProfileId = req.farmerProfile?.id;
    const { id } = req.params;

    // Verify ownership
    const { data: existing, error: findErr } = await supabase
      .from('products')
      .select('id, farmer_profile_id')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (findErr || !existing) {
      return error(res, 'Product not found', 404);
    }

    if (existing.farmer_profile_id !== farmerProfileId) {
      return error(res, 'Unauthorized: You do not own this product', 403);
    }

    const {
      crop_name,
      category,
      description,
      quantity_available,
      quantity_unit,
      price_per_quintal,
      harvest_date,
      available_from,
      quality_grade,
      latitude,
      longitude,
      city,
      state,
      status,
      images,
    } = req.body;

    const updatePayload = {
      updated_at: new Date().toISOString(),
    };

    if (crop_name !== undefined) updatePayload.crop_name = crop_name.trim();
    if (category !== undefined) updatePayload.category = category;
    if (description !== undefined) updatePayload.description = description.trim();
    if (quantity_available !== undefined) updatePayload.quantity_available = Number(quantity_available);
    if (quantity_unit !== undefined) updatePayload.quantity_unit = quantity_unit;
    if (price_per_quintal !== undefined) updatePayload.price_per_quintal = Number(price_per_quintal);
    if (harvest_date !== undefined) updatePayload.harvest_date = harvest_date || null;
    if (available_from !== undefined) updatePayload.available_from = available_from || null;
    if (quality_grade !== undefined) updatePayload.quality_grade = quality_grade || null;
    if (latitude !== undefined) updatePayload.latitude = latitude ? Number(latitude) : null;
    if (longitude !== undefined) updatePayload.longitude = longitude ? Number(longitude) : null;
    if (city !== undefined) updatePayload.city = city ? city.trim() : null;
    if (state !== undefined) updatePayload.state = state ? state.trim() : null;
    if (status !== undefined) updatePayload.status = status;

    if (Array.isArray(images) && images.length > 0) {
      const primary = images.find(img => img.is_primary)?.image_url || images[0]?.image_url;
      updatePayload.primary_image_url = primary;

      // Replace images
      await supabase.from('product_images').delete().eq('product_id', id);
      const imageRows = images.map((img, idx) => ({
        product_id: id,
        image_url: img.image_url,
        storage_path: img.storage_path || null,
        is_primary: primary === img.image_url,
        display_order: idx,
      }));
      await supabase.from('product_images').insert(imageRows);
    }

    const { data: updated, error: updateErr } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select('*, images:product_images(*)')
      .single();

    if (updateErr) throw updateErr;

    return success(res, updated, 'Product updated successfully');
  } catch (err) {
    console.error('Error updating product:', err);
    return error(res, 'Failed to update product: ' + err.message, 500);
  }
};

/**
 * Soft delete a product
 */
const deleteProduct = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const farmerProfileId = req.farmerProfile?.id;
    const { id } = req.params;

    const { data: existing, error: findErr } = await supabase
      .from('products')
      .select('id, farmer_profile_id')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (findErr || !existing) {
      return error(res, 'Product not found', 404);
    }

    if (existing.farmer_profile_id !== farmerProfileId) {
      return error(res, 'Unauthorized: You do not own this product', 403);
    }

    // Soft delete to protect historical orders
    const { error: delErr } = await supabase
      .from('products')
      .update({
        deleted_at: new Date().toISOString(),
        status: 'Inactive',
      })
      .eq('id', id);

    if (delErr) throw delErr;

    return success(res, { id }, 'Product deleted successfully');
  } catch (err) {
    return error(res, 'Failed to delete product: ' + err.message, 500);
  }
};

module.exports = {
  getPublicProducts,
  getFarmerProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
