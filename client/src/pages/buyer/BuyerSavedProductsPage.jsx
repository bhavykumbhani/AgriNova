import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { savedProductService } from '../../services/savedProductService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const BuyerSavedProductsPage = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const data = await savedProductService.getSavedProducts();
      setSavedItems(data);
    } catch (err) {
      toast.error('Failed to load saved crops: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await savedProductService.toggleSave(productId);
      setSavedItems((prev) => prev.filter((s) => s.product?.id !== productId));
      toast.success('Removed from saved crops');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Saved Products
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your procurement watchlist for upcoming harvest lots and favorite crops.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 mt-3">Loading saved items...</p>
        </div>
      ) : savedItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#112D25] rounded-2xl border border-dashed border-slate-200 dark:border-[#21453A] p-8">
          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            You haven't saved any crops yet.
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            Save crops while browsing the marketplace to compare pricing and monitor harvest dates.
          </p>
          <Link to="/buyer/marketplace">
            <Button variant="primary" className="bg-teal-600 hover:bg-teal-700">
              Browse Marketplace
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <Card key={item.id} padding="p-0" className="overflow-hidden flex flex-col justify-between">
                <div className="relative h-44 bg-slate-100 dark:bg-slate-800">
                  {product.primary_image_url ? (
                    <img
                      src={product.primary_image_url}
                      alt={product.crop_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🌾
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-xs text-white">
                      {product.category}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-rose-500 hover:bg-rose-50 transition-colors shadow-xs"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {product.crop_name}
                      </h3>
                      <span className="text-base font-black text-teal-600 dark:text-teal-400 shrink-0">
                        ₹{Number(product.price_per_quintal).toLocaleString('en-IN')}/qtl
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-[#21453A] text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Available</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {product.quantity_available} {product.quantity_unit || 'quintal'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Origin</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                          {product.city || 'India'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#21453A] flex items-center justify-between">
                    <span className="text-xs text-slate-500 truncate max-w-[130px]">
                      {product.farmer?.farm_name || 'Verified Farm'}
                    </span>

                    <Link to={`/buyer/marketplace/${product.id}`}>
                      <Button variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs">
                        View & Order
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
