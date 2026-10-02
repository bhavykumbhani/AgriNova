import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Bookmark,
  ShoppingBag,
  MapPin,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { savedProductService } from '../../services/savedProductService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

export const BuyerMarketplacePage = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    fetchProducts();
    fetchSavedIds();
  }, [category, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getPublicProducts({
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        sort,
      });
      setProducts(data.products || []);
    } catch (err) {
      toast.error('Failed to load marketplace products');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedIds = async () => {
    try {
      const saved = await savedProductService.getSavedProducts();
      setSavedIds(new Set((saved || []).map((s) => s.product?.id || s.product_id)));
    } catch (e) {}
  };

  const handleToggleSave = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await savedProductService.toggleSave(productId);
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (res.isSaved) next.add(productId);
        else next.delete(productId);
        return next;
      });
      toast.success(res.isSaved ? 'Product saved to watchlist' : 'Product removed from watchlist');
    } catch (err) {
      toast.error('Failed to update saved item');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds', 'Spices', 'Cash Crops', 'Other'];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          AgriNova Marketplace
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Direct wholesale procurement from verified farmers. Real-time availability, zero middlemen.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card padding="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search crop, mandi, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="price_desc">Sort: Price High → Low</option>
              <option value="price_asc">Sort: Price Low → High</option>
            </select>
          </div>
        </form>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 mt-3">Loading fresh listings...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#112D25] rounded-2xl border border-dashed border-slate-200 dark:border-[#21453A] p-8">
          <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No crops matching your criteria
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Try adjusting your search terms or selecting a different crop category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => {
            const isSaved = savedIds.has(product.id);
            return (
              <Card key={product.id} padding="p-0" className="overflow-hidden flex flex-col justify-between">
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
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
                    onClick={(e) => handleToggleSave(product.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-slate-700 dark:text-slate-200 hover:text-rose-600 transition-colors shadow-xs"
                    title={isSaved ? 'Remove from saved' : 'Save crop'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
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

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {product.description || 'No description provided.'}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-[#21453A] text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Available Volume</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {product.quantity_available} {product.quantity_unit || 'quintal'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Origin Location</span>
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
