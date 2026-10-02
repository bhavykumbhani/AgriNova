import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBag,
  Receipt,
  Bookmark,
  Users,
  IndianRupee,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import { orderService } from '../../services/orderService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const BuyerDashboardPage = () => {
  const { profile, buyerProfile } = useAuth();
  const { t } = useTranslation();

  const [analytics, setAnalytics] = useState({
    activeOrders: 0,
    completedOrders: 0,
    savedProducts: 0,
    farmersConnected: 0,
    totalPurchaseValue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsData, ordersData] = await Promise.all([
        analyticsService.getBuyerAnalytics(),
        orderService.getBuyerOrders({ limit: 5 }),
      ]);
      setAnalytics(analyticsData);
      setRecentOrders(ordersData.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      case 'Shipped':
        return <Badge variant="info">Shipped</Badge>;
      case 'Processing':
      case 'Confirmed':
      case 'Accepted':
        return <Badge variant="primary">{status}</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Cancelled':
      case 'Rejected':
        return <Badge variant="danger">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#112D25] p-6 rounded-2xl border border-slate-200 dark:border-[#21453A] shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, {profile?.first_name || 'Buyer'}!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {buyerProfile?.company_name ? `${buyerProfile.company_name} Procurement Console` : 'Source fresh crops directly from verified Indian farmers.'}
          </p>
        </div>

        <Link to="/buyer/marketplace">
          <Button variant="primary" className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700">
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Marketplace</span>
          </Button>
        </Link>
      </div>

      {/* Real KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Orders */}
        <Card padding="p-5" className="border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Orders
            </span>
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {analytics.activeOrders}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">In progress fulfillment</p>
          </div>
        </Card>

        {/* Completed Orders */}
        <Card padding="p-5" className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completed Orders
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {analytics.completedOrders}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Successfully fulfilled</p>
          </div>
        </Card>

        {/* Saved Products */}
        <Card padding="p-5" className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Saved Products
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Bookmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {analytics.savedProducts}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Watchlist items</p>
          </div>
        </Card>

        {/* Total Purchase Value */}
        <Card padding="p-5" className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Purchase Value
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{Number(analytics.totalPurchaseValue || 0).toLocaleString('en-IN')}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">From completed contracts</p>
          </div>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/buyer/marketplace" className="block">
          <Card hoverEffect padding="p-5" className="h-full flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Marketplace
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Explore current crop lots</p>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-600" />
          </Card>
        </Link>

        <Link to="/buyer/farmers" className="block">
          <Card hoverEffect padding="p-5" className="h-full flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Farmers Directory
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Connect with producers</p>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-600" />
          </Card>
        </Link>

        <Link to="/buyer/saved" className="block">
          <Card hoverEffect padding="p-5" className="h-full flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Saved Items
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Review your shortlists</p>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-600" />
          </Card>
        </Link>
      </div>

      {/* Recent Orders */}
      <Card padding="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track contract status and dispatch tracking
            </p>
          </div>
          <Link to="/buyer/orders">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No orders placed yet
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Find fresh crops on the marketplace and request a purchase quote directly from the farmer.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#21453A] text-slate-400 text-xs uppercase font-semibold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Farmer</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-teal-700 dark:text-teal-400">
                      {order.order_number || order.id.substring(0, 8)}
                    </td>
                    <td className="py-3 px-4">
                      {order.farmer?.farm_name || `${order.farmer?.profile?.first_name || 'Farmer'}`}
                    </td>
                    <td className="py-3 px-4">
                      <span>{order.product?.crop_name}</span>
                    </td>
                    <td className="py-3 px-4">
                      {order.quantity} {order.quantity_unit}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/buyer/orders/${order.id}`}
                        className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
