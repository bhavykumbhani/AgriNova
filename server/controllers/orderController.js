const { supabase, isConfigured } = require('../config/supabase');
const { success, error } = require('../utils/responseFormatter');
const { getIO } = require('../socket');

/**
 * Place a new order (Buyer only)
 */
const createOrder = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const buyerProfileId = req.buyerProfile?.id;
    if (!buyerProfileId) {
      return error(res, 'Buyer profile not found for this account', 403);
    }

    const {
      product_id,
      quantity,
      delivery_method = 'Delivery',
      delivery_address = '',
      notes = '',
    } = req.body;

    if (!product_id || !quantity) {
      return error(res, 'Product ID and quantity are required', 400);
    }

    const orderQty = Number(quantity);
    if (isNaN(orderQty) || orderQty <= 0) {
      return error(res, 'Quantity must be greater than 0', 400);
    }

    // 1. Fetch product
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .select('id, farmer_profile_id, crop_name, price_per_quintal, quantity_available, quantity_unit, status')
      .eq('id', product_id)
      .is('deleted_at', null)
      .single();

    if (prodErr || !product) {
      return error(res, 'Product not found or is no longer listed', 404);
    }

    if (product.status !== 'Active') {
      return error(res, `This product is currently ${product.status.toLowerCase()} and cannot be ordered`, 400);
    }

    if (orderQty > Number(product.quantity_available)) {
      return error(
        res,
        `Requested quantity (${orderQty}) exceeds available inventory (${product.quantity_available} ${product.quantity_unit})`,
        400
      );
    }

    const unitPrice = Number(product.price_per_quintal);
    const totalAmount = unitPrice * orderQty;

    // 2. Insert order
    const { data: newOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        product_id: product.id,
        farmer_profile_id: product.farmer_profile_id,
        buyer_profile_id: buyerProfileId,
        quantity: orderQty,
        quantity_unit: product.quantity_unit || 'quintal',
        unit_price: unitPrice,
        total_amount: totalAmount,
        status: 'Pending',
        delivery_method,
        delivery_address: delivery_address.trim(),
        notes: notes.trim(),
      })
      .select(`
        *,
        product:products(id, crop_name, category, primary_image_url),
        farmer:farmer_profiles(id, farm_name, profile:profiles(first_name, last_name, phone)),
        buyer:buyer_profiles(id, company_name, profile:profiles(first_name, last_name, phone))
      `)
      .single();

    if (orderErr) throw orderErr;

    // 3. Send notification to farmer
    try {
      const { data: farmerRow } = await supabase
        .from('farmer_profiles')
        .select('profile_id')
        .eq('id', product.farmer_profile_id)
        .single();

      if (farmerRow?.profile_id) {
        await supabase.from('notifications').insert({
          profile_id: farmerRow.profile_id,
          type: 'order',
          title: 'New Order Received',
          message: `Buyer requested ${orderQty} ${product.quantity_unit || 'quintal'} of ${product.crop_name} (Order: ${newOrder.order_number || 'New'})`,
          entity_type: 'order',
          entity_id: newOrder.id,
        });

        const io = getIO();
        if (io) {
          io.to(`user:${farmerRow.profile_id}`).emit('new_notification', {
            type: 'order',
            title: 'New Order Received',
            order: newOrder,
          });
        }
      }
    } catch (notifErr) {
      console.error('Failed to create notification for order:', notifErr);
    }

    return success(res, newOrder, 'Order request placed successfully', 201);
  } catch (err) {
    console.error('Error in createOrder:', err);
    return error(res, 'Failed to create order: ' + err.message, 500);
  }
};

/**
 * Get orders for authenticated farmer
 */
const getFarmerOrders = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const farmerProfileId = req.farmerProfile?.id;
    if (!farmerProfileId) return error(res, 'Farmer profile not found', 404);

    const { status, search, page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('orders')
      .select(`
        *,
        product:products(id, crop_name, category, primary_image_url),
        buyer:buyer_profiles(
          id,
          company_name,
          city,
          state,
          profile:profiles(id, first_name, last_name, email, phone)
        )
      `, { count: 'exact' })
      .eq('farmer_profile_id', farmerProfileId);

    if (status && status !== 'All') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const from = (pageNum - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to);

    const { data: orders, count, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;

    return success(res, {
      orders: orders || [],
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (err) {
    return error(res, 'Failed to fetch farmer orders: ' + err.message, 500);
  }
};

/**
 * Get orders for authenticated buyer
 */
const getBuyerOrders = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const buyerProfileId = req.buyerProfile?.id;
    if (!buyerProfileId) return error(res, 'Buyer profile not found', 404);

    const { status, search, page = 1, limit = 20 } = req.query;

    let query = supabase
      .from('orders')
      .select(`
        *,
        product:products(id, crop_name, category, primary_image_url),
        farmer:farmer_profiles(
          id,
          farm_name,
          farm_location,
          profile:profiles(id, first_name, last_name, email, phone)
        )
      `, { count: 'exact' })
      .eq('buyer_profile_id', buyerProfileId);

    if (status && status !== 'All') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false });

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const from = (pageNum - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.range(from, to);

    const { data: orders, count, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;

    return success(res, {
      orders: orders || [],
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (err) {
    return error(res, 'Failed to fetch buyer orders: ' + err.message, 500);
  }
};

/**
 * Get single order details
 */
const getOrderById = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const { id } = req.params;
    const { data: order, error: fetchErr } = await supabase
      .from('orders')
      .select(`
        *,
        product:products(*),
        farmer:farmer_profiles(
          id,
          farm_name,
          farm_location,
          profile:profiles(id, first_name, last_name, email, phone, avatar_url)
        ),
        buyer:buyer_profiles(
          id,
          company_name,
          business_type,
          city,
          state,
          business_address,
          profile:profiles(id, first_name, last_name, email, phone, avatar_url)
        )
      `)
      .eq('id', id)
      .single();

    if (fetchErr || !order) return error(res, 'Order not found', 404);

    // Verify participant
    const isFarmer = req.farmerProfile && order.farmer_profile_id === req.farmerProfile.id;
    const isBuyer = req.buyerProfile && order.buyer_profile_id === req.buyerProfile.id;

    if (!isFarmer && !isBuyer && req.profile?.role !== 'admin') {
      return error(res, 'Unauthorized to view this order', 403);
    }

    return success(res, order);
  } catch (err) {
    return error(res, 'Failed to fetch order: ' + err.message, 500);
  }
};

/**
 * Update order status (with inventory deduction/restoration)
 */
const updateOrderStatus = async (req, res) => {
  try {
    if (!isConfigured) return error(res, 'Database service is not configured', 503);

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Accepted', 'Rejected', 'Confirmed', 'Processing', 'Shipped', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return error(res, `Invalid order status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    // 1. Fetch current order
    const { data: currentOrder, error: orderErr } = await supabase
      .from('orders')
      .select('*, product:products(*)')
      .eq('id', id)
      .single();

    if (orderErr || !currentOrder) return error(res, 'Order not found', 404);

    const isFarmer = req.farmerProfile && currentOrder.farmer_profile_id === req.farmerProfile.id;
    const isBuyer = req.buyerProfile && currentOrder.buyer_profile_id === req.buyerProfile.id;

    if (!isFarmer && !isBuyer && req.profile?.role !== 'admin') {
      return error(res, 'Unauthorized to modify this order', 403);
    }

    // Permissions check
    if (isBuyer && !['Cancelled'].includes(status)) {
      return error(res, 'Buyers may only cancel pending orders', 403);
    }

    const previousStatus = currentOrder.status;
    const orderQty = Number(currentOrder.quantity);
    const updatePayload = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'Completed') {
      updatePayload.completed_at = new Date().toISOString();
    } else if (status === 'Cancelled') {
      updatePayload.cancelled_at = new Date().toISOString();
    }

    // Inventory handling:
    // When order is Accepted or Confirmed for the first time from Pending, deduct quantity
    if (['Accepted', 'Confirmed'].includes(status) && previousStatus === 'Pending') {
      const currentAvail = Number(currentOrder.product?.quantity_available || 0);
      const newAvail = Math.max(0, currentAvail - orderQty);
      const newProdStatus = newAvail === 0 ? 'Sold Out' : currentOrder.product?.status;

      await supabase
        .from('products')
        .update({
          quantity_available: newAvail,
          status: newProdStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentOrder.product_id);
    }

    // When order is Cancelled or Rejected after having been Accepted/Confirmed, restore quantity
    if (['Cancelled', 'Rejected'].includes(status) && ['Accepted', 'Confirmed', 'Processing'].includes(previousStatus)) {
      const currentAvail = Number(currentOrder.product?.quantity_available || 0);
      const restoredAvail = currentAvail + orderQty;

      await supabase
        .from('products')
        .update({
          quantity_available: restoredAvail,
          status: 'Active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentOrder.product_id);
    }

    // Update order record
    const { data: updatedOrder, error: updateErr } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select(`
        *,
        product:products(id, crop_name, category, primary_image_url),
        farmer:farmer_profiles(id, farm_name, profile:profiles(id, first_name, last_name, phone)),
        buyer:buyer_profiles(id, company_name, profile:profiles(id, first_name, last_name, phone))
      `)
      .single();

    if (updateErr) throw updateErr;

    // Send notifications to the other party
    try {
      const notifyProfileId = isFarmer
        ? updatedOrder.buyer?.profile?.id
        : updatedOrder.farmer?.profile?.id;

      if (notifyProfileId) {
        await supabase.from('notifications').insert({
          profile_id: notifyProfileId,
          type: 'order',
          title: `Order ${status}`,
          message: `Order ${updatedOrder.order_number || ''} status was updated to ${status}.`,
          entity_type: 'order',
          entity_id: updatedOrder.id,
        });

        const io = getIO();
        if (io) {
          io.to(`user:${notifyProfileId}`).emit('order_status_updated', {
            order: updatedOrder,
            status,
          });
        }
      }
    } catch (notifErr) {
      console.error('Error sending order status notification:', notifErr);
    }

    return success(res, updatedOrder, `Order status updated to ${status}`);
  } catch (err) {
    console.error('Error in updateOrderStatus:', err);
    return error(res, 'Failed to update order: ' + err.message, 500);
  }
};

module.exports = {
  createOrder,
  getFarmerOrders,
  getBuyerOrders,
  getOrderById,
  updateOrderStatus,
};
