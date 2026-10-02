import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Package,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Truck,
  MessageSquare,
  AlertCircle,
  IndianRupee,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { messageService } from '../../services/messageService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const FarmerOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (err) {
      toast.error('Failed to load order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const updated = await orderService.updateOrderStatus(id, newStatus);
      setOrder(updated);
      toast.success(`Order status updated to ${newStatus}`);
      if (cancelModalOpen) setCancelModalOpen(false);
    } catch (err) {
      toast.error('Failed to update status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleMessageBuyer = async () => {
    try {
      if (!order?.buyer_profile_id) return;
      const conv = await messageService.getOrCreateConversation({
        buyer_profile_id: order.buyer_profile_id,
        farmer_profile_id: order.farmer_profile_id,
        product_id: order.product_id,
      });
      navigate('/farmer/messages', { state: { conversationId: conv.id } });
    } catch (err) {
      toast.error('Could not initiate conversation: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 mt-3">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 bg-white dark:bg-[#112D25] rounded-2xl border border-slate-200 dark:border-[#21453A] p-8 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Order not found</h2>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          This order does not exist or you do not have permission to view it.
        </p>
        <Link to="/farmer/orders">
          <Button variant="primary">Return to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/farmer/orders"
            className="p-2 rounded-xl bg-white dark:bg-[#112D25] border border-slate-200 dark:border-[#21453A] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                {order.order_number || `Order #${order.id.substring(0, 8)}`}
              </h1>
              <Badge variant={order.status === 'Completed' ? 'success' : order.status === 'Cancelled' ? 'danger' : 'primary'}>
                {order.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Placed on {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleMessageBuyer}
            className="flex items-center gap-2 text-xs"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Message Buyer</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details (Product + Order Items) */}
        <div className="md:col-span-2 space-y-6">
          {/* Product & Pricing Snapshot */}
          <Card padding="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Ordered Crop
            </h3>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              {order.product?.primary_image_url ? (
                <img
                  src={order.product.primary_image_url}
                  alt={order.product.crop_name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl shrink-0">
                  🌾
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {order.product?.crop_name || 'Crop Listing'}
                    </h4>
                    <span className="text-xs text-slate-400 font-semibold">
                      Category: {order.product?.category}
                    </span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Grade {order.product?.quality_grade || 'Standard'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Agreed Unit Rate</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      ₹{Number(order.unit_price).toLocaleString('en-IN')}/{order.quantity_unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ordered Volume</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {order.quantity} {order.quantity_unit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#21453A] space-y-2 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Subtotal ({order.quantity} {order.quantity_unit})</span>
                <span>₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs">
                <span>Platform Commission / Fees</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">₹0 (Zero Fee)</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 dark:text-white text-base pt-2 border-t border-slate-100 dark:border-[#21453A]">
                <span>Total Amount Due</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-xl">
                  ₹{Number(order.total_amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </Card>

          {/* Delivery & Logistics */}
          <Card padding="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Delivery & Instructions
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Fulfillment Method: {order.delivery_method || 'Direct Pickup / Delivery'}
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    {order.delivery_address || 'Address to be coordinated directly between farmer and buyer.'}
                  </p>
                </div>
              </div>

              {order.notes && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Buyer Note:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 italic">
                    "{order.notes}"
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar Info (Buyer Profile + Actions) */}
        <div className="space-y-6">
          {/* Status Progression Controls */}
          <Card padding="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Order Workflow
            </h3>

            <div className="space-y-2.5">
              {order.status === 'Pending' && (
                <>
                  <Button
                    variant="primary"
                    className="w-full"
                    disabled={updating}
                    onClick={() => handleUpdateStatus('Accepted')}
                  >
                    Accept Order
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-rose-600 hover:bg-rose-50 border-rose-200"
                    disabled={updating}
                    onClick={() => handleUpdateStatus('Rejected')}
                  >
                    Reject Order
                  </Button>
                </>
              )}

              {order.status === 'Accepted' && (
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={updating}
                  onClick={() => handleUpdateStatus('Confirmed')}
                >
                  Confirm Contract
                </Button>
              )}

              {order.status === 'Confirmed' && (
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={updating}
                  onClick={() => handleUpdateStatus('Processing')}
                >
                  Mark as Processing / Packing
                </Button>
              )}

              {order.status === 'Processing' && (
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={updating}
                  onClick={() => handleUpdateStatus('Shipped')}
                >
                  Mark as Shipped / Dispatched
                </Button>
              )}

              {order.status === 'Shipped' && (
                <Button
                  variant="primary"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={updating}
                  onClick={() => handleUpdateStatus('Completed')}
                >
                  Complete Order (Payment Received)
                </Button>
              )}

              {['Pending', 'Accepted', 'Confirmed'].includes(order.status) && (
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(true)}
                  className="w-full py-2 text-xs font-semibold text-rose-600 hover:underline"
                >
                  Cancel Order
                </button>
              )}

              {order.status === 'Completed' && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs font-semibold text-center">
                  ✓ Order successfully completed and recorded in revenue analytics.
                </div>
              )}

              {order.status === 'Cancelled' && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs font-semibold text-center">
                  Order was cancelled.
                </div>
              )}
            </div>
          </Card>

          {/* Buyer Details */}
          <Card padding="p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Buyer Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {order.buyer?.company_name || 'Individual Buyer'}
                  </span>
                  <span className="text-slate-400">{order.buyer?.business_type || 'Retailer/Trader'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-800 dark:text-slate-200">
                  {order.buyer?.profile?.phone || 'Not provided'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-800 dark:text-slate-200">
                  {order.buyer?.profile?.email || 'Confidential'}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-800 dark:text-slate-200">
                  {order.buyer?.city ? `${order.buyer.city}, ${order.buyer.state || ''}` : 'Location unlisted'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal for Cancel */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={() => handleUpdateStatus('Cancelled')}
        isLoading={updating}
        title="Cancel Order?"
        message="Are you sure you want to cancel this order? The reserved inventory will be restored to your active product listing."
        confirmText="Cancel Order"
      />
    </div>
  );
};
