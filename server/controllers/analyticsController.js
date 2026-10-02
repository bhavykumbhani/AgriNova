const { supabase, isConfigured } = require('../config/supabase');
const { success, error } = require('../utils/responseFormatter');

/**
 * Get real analytics for authenticated farmer
 */
const getFarmerAnalytics = async (req, res) => {
  try {
    if (!isConfigured) {
      return error(res, 'Database service is not configured.', 503);
    }

    const farmerProfileId = req.farmerProfile?.id;
    if (!farmerProfileId) {
      return error(res, 'Farmer profile not found for this account.', 404);
    }

    const { period = '30d' } = req.query;

    // 1. Get Completed Orders & Total Revenue
    const { data: completedOrders, error: compErr } = await supabase
      .from('orders')
      .select('id, total_amount, completed_at, created_at, buyer_profile_id')
      .eq('farmer_profile_id', farmerProfileId)
      .eq('status', 'Completed');

    if (compErr) throw compErr;

    const totalRevenue = (completedOrders || []).reduce((acc, order) => acc + Number(order.total_amount || 0), 0);
    const completedOrdersCount = (completedOrders || []).length;

    // 2. Count Active Products Listed (not deleted)
    const { count: productsListedCount, error: prodErr } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('farmer_profile_id', farmerProfileId)
      .is('deleted_at', null);

    if (prodErr) throw prodErr;

    // 3. Count Active Buyers (buyers who have non-cancelled orders or conversations)
    const { data: allFarmerOrders, error: orderErr } = await supabase
      .from('orders')
      .select('buyer_profile_id')
      .eq('farmer_profile_id', farmerProfileId)
      .neq('status', 'Cancelled');

    if (orderErr) throw orderErr;

    const { data: farmerConvs, error: convErr } = await supabase
      .from('conversations')
      .select('buyer_profile_id')
      .eq('farmer_profile_id', farmerProfileId);

    if (convErr) throw convErr;

    const buyerIdSet = new Set();
    (allFarmerOrders || []).forEach(o => o.buyer_profile_id && buyerIdSet.add(o.buyer_profile_id));
    (farmerConvs || []).forEach(c => c.buyer_profile_id && buyerIdSet.add(c.buyer_profile_id));
    const activeBuyers = buyerIdSet.size;

    // 4. Revenue Series by Period
    // Periods: 7d, 30d, 3m, 6m, 1y
    const now = new Date();
    let daysToSubtract = 30;
    if (period === '7d') daysToSubtract = 7;
    else if (period === '30d') daysToSubtract = 30;
    else if (period === '3m') daysToSubtract = 90;
    else if (period === '6m') daysToSubtract = 180;
    else if (period === '1y') daysToSubtract = 365;

    const startDate = new Date(now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000);

    // Group completed orders by date
    const dateMap = {};
    // Populate keys for smooth chart display
    const step = daysToSubtract <= 30 ? 1 : Math.ceil(daysToSubtract / 30);
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + step)) {
      const key = d.toISOString().split('T')[0];
      dateMap[key] = { date: key, revenue: 0, orders: 0 };
    }

    (completedOrders || []).forEach(o => {
      const orderDate = new Date(o.completed_at || o.created_at);
      if (orderDate >= startDate) {
        const key = orderDate.toISOString().split('T')[0];
        if (!dateMap[key]) {
          dateMap[key] = { date: key, revenue: 0, orders: 0 };
        }
        dateMap[key].revenue += Number(o.total_amount || 0);
        dateMap[key].orders += 1;
      }
    });

    const revenueSeries = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

    // 5. Recent 5 Orders
    const { data: recentOrders, error: recentErr } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        quantity,
        quantity_unit,
        unit_price,
        total_amount,
        status,
        created_at,
        product:products(id, crop_name, category, primary_image_url),
        buyer:buyer_profiles(
          id,
          company_name,
          profile:profiles(first_name, last_name, email, phone)
        )
      `)
      .eq('farmer_profile_id', farmerProfileId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentErr) throw recentErr;

    // 6. Top selling crops (from completed orders)
    const { data: completedWithProduct, error: topErr } = await supabase
      .from('orders')
      .select('quantity, total_amount, product:products(crop_name)')
      .eq('farmer_profile_id', farmerProfileId)
      .eq('status', 'Completed');

    const cropStats = {};
    if (!topErr && completedWithProduct) {
      completedWithProduct.forEach(item => {
        const cropName = item.product?.crop_name || 'Other';
        if (!cropStats[cropName]) {
          cropStats[cropName] = { cropName, revenue: 0, quantity: 0 };
        }
        cropStats[cropName].revenue += Number(item.total_amount || 0);
        cropStats[cropName].quantity += Number(item.quantity || 0);
      });
    }

    const topSellingCrops = Object.values(cropStats).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    return success(res, {
      totalRevenue,
      productsListed: productsListedCount || 0,
      completedOrders: completedOrdersCount,
      activeBuyers,
      revenueSeries,
      recentOrders: recentOrders || [],
      topSellingCrops,
    }, 'Farmer analytics retrieved successfully');
  } catch (err) {
    console.error('Error in getFarmerAnalytics:', err);
    return error(res, 'Failed to retrieve analytics: ' + err.message, 500);
  }
};

/**
 * Get Buyer Dashboard KPIs
 */
const getBuyerAnalytics = async (req, res) => {
  try {
    if (!isConfigured) {
      return error(res, 'Database service is not configured.', 503);
    }

    const buyerProfileId = req.buyerProfile?.id;
    if (!buyerProfileId) {
      return error(res, 'Buyer profile not found for this account.', 404);
    }

    // 1. Active Orders count
    const { count: activeOrders, error: actErr } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('buyer_profile_id', buyerProfileId)
      .in('status', ['Pending', 'Confirmed', 'Processing', 'Shipped']);

    if (actErr) throw actErr;

    // 2. Completed Orders count
    const { count: completedOrders, error: compErr } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('buyer_profile_id', buyerProfileId)
      .eq('status', 'Completed');

    if (compErr) throw compErr;

    // 3. Saved Products count
    const { count: savedProducts, error: saveErr } = await supabase
      .from('saved_products')
      .select('id', { count: 'exact', head: true })
      .eq('buyer_profile_id', buyerProfileId);

    if (saveErr) throw saveErr;

    // 4. Farmers Connected
    const { data: allBuyerOrders } = await supabase
      .from('orders')
      .select('farmer_profile_id')
      .eq('buyer_profile_id', buyerProfileId);

    const { data: buyerConvs } = await supabase
      .from('conversations')
      .select('farmer_profile_id')
      .eq('buyer_profile_id', buyerProfileId);

    const farmerIdSet = new Set();
    (allBuyerOrders || []).forEach(o => o.farmer_profile_id && farmerIdSet.add(o.farmer_profile_id));
    (buyerConvs || []).forEach(c => c.farmer_profile_id && farmerIdSet.add(c.farmer_profile_id));
    const farmersConnected = farmerIdSet.size;

    // 5. Total Purchase Value (from completed orders)
    const { data: completedPurchaseRows } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('buyer_profile_id', buyerProfileId)
      .eq('status', 'Completed');

    const totalPurchaseValue = (completedPurchaseRows || []).reduce(
      (sum, row) => sum + Number(row.total_amount || 0),
      0
    );

    return success(res, {
      activeOrders: activeOrders || 0,
      completedOrders: completedOrders || 0,
      savedProducts: savedProducts || 0,
      farmersConnected,
      totalPurchaseValue,
    });
  } catch (err) {
    console.error('Error in getBuyerAnalytics:', err);
    return error(res, 'Failed to retrieve buyer analytics: ' + err.message, 500);
  }
};

module.exports = {
  getFarmerAnalytics,
  getBuyerAnalytics,
};
