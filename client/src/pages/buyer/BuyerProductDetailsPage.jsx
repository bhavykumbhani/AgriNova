import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Bookmark,
  MessageSquare,
  ShoppingCart,
  MapPin,
  Calendar,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  Truck,
  IndianRupee,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { savedProductService } from '../../services/savedProductService';
import { orderService } from '../../services/orderService';
import { messageService } from '../../services/messageService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const BuyerProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Purchase Modal state
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    fetchProduct();
    checkIfSaved();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      if (!data) {
        setNotFound(true);
        return;
      }
      setProduct(data);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const saved = await savedProductService.getSavedProducts();
      const match = (saved || []).some((s) => s.product?.id === id || s.product_id === id);
      setIsSaved(match);
    } catch (e) {}
  };

  const handleToggleSave = async () => {
    try {
      const res = await savedProductService.toggleSave(id);
      setIsSaved(res.isSaved);
      toast.success(res.isSaved ? 'Added to watchlist' : 'Removed from watchlist');
    } catch (err) {
      toast.error('Failed to update watchlist');
    }
  };

  const handleContactFarmer = async () => {
    try {
      if (!product?.farmer_profile_id) return;
      const conv = await messageService.getOrCreateConversation({
        farmer_profile_id: product.farmer_profile_id,
        product_id: product.id,
      });
      navigate('/buyer/messages', { state: { conversationId: conv.id } });
    } catch (err) {
      toast.error('Could not initiate conversation: ' + err.message);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const qty = Number(orderQuantity);
    if (!qty || qty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    if (qty > Number(product.quantity_available)) {
      toast.error(`Quantity cannot exceed available inventory (${product.quantity_available} ${product.quantity_unit})`);
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error('Please provide a delivery address or pickup instructions');
      return;
    }

    try {
      setOrdering(true);
      const newOrder = await orderService.createOrder({
        product_id: product.id,
        quantity: qty,
        delivery_method: deliveryMethod,
        delivery_address: deliveryAddress.trim(),
        notes: notes.trim(),
      });

      toast.success('Purchase request submitted successfully!');
      setPurchaseModalOpen(false);
      navigate(`/buyer/orders/${newOrder.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 mt-3">Loading listing details...</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="text-center py-20 bg-white dark:bg-[#112D25] rounded-2xl border border-slate-200 dark:border-[#21453A] p-8 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Product not found</h2>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          This crop listing may have been sold out or archived by the farmer.
        </p>
        <Link to="/buyer/marketplace">
          <Button variant="primary" className="bg-teal-600">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const imagesList = (product.images && product.images.length > 0)
    ? product.images.map(img => img.image_url)
    : product.primary_image_url
    ? [product.primary_image_url]
    : [];

  const calculatedTotal = Number(orderQuantity || 0) * Number(product.price_per_quintal || 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/buyer/marketplace"
          className="p-2 rounded-xl bg-white dark:bg-[#112D25] border border-slate-200 dark:border-[#21453A] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleSave}
            className="flex items-center gap-1.5 text-xs"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleContactFarmer}
            className="flex items-center gap-1.5 text-xs"
          >
            <MessageSquare className="w-4 h-4 text-teal-600" />
            <span>Contact Farmer</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Images Column */}
        <div className="lg:col-span-6 space-y-3">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 relative shadow-sm">
            {imagesList.length > 0 ? (
              <img
                src={imagesList[activeImageIndex] || imagesList[0]}
                alt={product.crop_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🌾
              </div>
            )}

            <div className="absolute top-3 left-3">
              <Badge variant="success">Grade {product.quality_grade || 'Standard'}</Badge>
            </div>
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {imagesList.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === i
                      ? 'border-teal-600 shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="lg:col-span-6 space-y-6">
          <Card padding="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  {product.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                  {product.crop_name}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{product.city ? `${product.city}, ${product.state || ''}` : 'Origin Location Provided'}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-teal-600 dark:text-teal-400 block">
                  ₹{Number(product.price_per_quintal).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">per quintal (100 kg)</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4 pt-4 border-t border-slate-100 dark:border-[#21453A]">
              {product.description || 'Verified agricultural listing with guaranteed farm pickup and clear quality grade.'}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-[#21453A] text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <span className="text-slate-400 block text-[11px]">Available Volume</span>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  {product.quantity_available} {product.quantity_unit || 'quintal'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <span className="text-slate-400 block text-[11px]">Harvest Date</span>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  {product.harvest_date
                    ? new Date(product.harvest_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Recent Harvest'}
                </span>
              </div>
            </div>

            {/* Order Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#21453A]">
              <Button
                variant="primary"
                onClick={() => {
                  setOrderQuantity(Math.min(10, Number(product.quantity_available)).toString());
                  setPurchaseModalOpen(true);
                }}
                className="w-full bg-teal-600 hover:bg-teal-700 py-3 text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Request Purchase Quote</span>
              </Button>
            </div>
          </Card>

          {/* Farmer Profile Summary */}
          <Card padding="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Producer Profile
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Producer
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center overflow-hidden shrink-0">
                {product.farmer?.profile?.avatar_url ? (
                  <img src={product.farmer.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  (product.farmer?.profile?.first_name?.[0] || 'F').toUpperCase()
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {product.farmer?.farm_name || 'AgriNova Farm'}
                </h4>
                <p className="text-xs text-slate-400">
                  Farmer: {product.farmer?.profile?.first_name} {product.farmer?.profile?.last_name || ''}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Farm Location: {product.farmer?.farm_location || product.city || 'Gujarat, India'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Purchase Request Modal */}
      <Modal
        isOpen={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        title={`Purchase Quote: ${product.crop_name}`}
      >
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              <span>Required Quantity ({product.quantity_unit || 'quintal'}) *</span>
              <span className="text-teal-600 font-semibold">Max: {product.quantity_available}</span>
            </div>
            <input
              type="number"
              min="0.1"
              max={product.quantity_available}
              step="any"
              required
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">Unit Rate</span>
              <span className="font-bold text-slate-900 dark:text-white">
                ₹{Number(product.price_per_quintal).toLocaleString('en-IN')}/{product.quantity_unit}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Estimated Total</span>
              <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">
                ₹{Number(calculatedTotal).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Fulfillment Method
            </label>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Delivery">Direct Delivery (Carrier coordinated)</option>
              <option value="Farm Pickup">Buyer Self-Pickup at Farm</option>
              <option value="Mandi Logistics">Mandi Logistics / Terminal Hub</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Delivery Address or Mandi Warehouse *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Warehouse address, gate number, city, pin code..."
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Notes for Farmer (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Packaging requirements (jute bags / 50kg), loading dates, quality checks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPurchaseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={ordering}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Submit Order Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
