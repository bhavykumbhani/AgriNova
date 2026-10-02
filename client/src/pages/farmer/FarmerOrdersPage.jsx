import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  Filter,
  ArrowRight,
  Clock,
  Check,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const FarmerOrdersPage = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getFarmerOrders({
        status: status !== 'All' ? status : undefined,
        search: search.trim() || undefined,
      });
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to load orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleQuickStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const statuses = ['All', 'Pending', 'Accepted', 'Confirmed', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      case 'Shipped':
        return <Badge variant="info">Shipped</Badge>;
      case 'Processing':
      case 'Confirmed':
      case 'Accepted':
        return <Badge variant="primary">{st}</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Cancelled':
      case 'Rejected':
        return <Badge variant="danger">{st}</Badge>;
      default:
        return <Badge>{st}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Customer Orders
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review, accept, process, and track fulfillment for harvest purchase requests.
        </p>
      </div>

      {/* Filter and Search */}
      <Card padding="p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID (e.g. AGN-2026-000...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Card>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 mt-3">Loading order records...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#112D25] rounded-2xl border border-dashed border-slate-200 dark:border-[#21453A] p-8">
          <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No orders found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            When buyers place orders for your listed crops, they will be listed here with fulfillment steps.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#112D25] rounded-2xl border border-slate-200 dark:border-[#21453A] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#21453A] text-slate-400 text-xs uppercase font-semibold">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Buyer</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Rate / Unit</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {order.order_number || order.id.substring(0, 8)}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {order.buyer?.company_name || `${order.buyer?.profile?.first_name || 'Buyer'}`}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {order.buyer?.city ? `${order.buyer.city}, ${order.buyer.state || ''}` : 'Verified Buyer'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {order.product?.primary_image_url && (
                          <img
                            src={order.product.primary_image_url}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <span className="text-slate-900 dark:text-white block">{order.product?.crop_name}</span>
                          <span className="text-[10px] text-slate-400">{order.product?.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-800 dark:text-slate-200">
                      {order.quantity} {order.quantity_unit}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                      ₹{Number(order.unit_price).toLocaleString('en-IN')}/{order.quantity_unit}
                    </td>
                    <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                      ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'Pending' && (
                          <>
                            <button
                              disabled={updatingId === order.id}
                              onClick={() => handleQuickStatus(order.id, 'Accepted')}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              disabled={updatingId === order.id}
                              onClick={() => handleQuickStatus(order.id, 'Rejected')}
                              className="px-2 py-1 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <Link
                          to={`/farmer/orders/${order.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
