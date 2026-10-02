import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  Filter,
  Package,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../context/ToastContext';

export const FarmerProductsPage = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('newest');

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [category, status, sort]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getFarmerProducts({
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        status: status !== 'All' ? status : undefined,
        sort,
      });
      setProducts(data.products || []);
    } catch (err) {
      toast.error('Failed to load products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleteLoading(true);
      await productService.deleteProduct(productToDelete.id);
      toast.success('Product archived successfully');
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const categories = ['All', 'Grains', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds', 'Spices', 'Cash Crops', 'Other'];
  const statuses = ['All', 'Active', 'Draft', 'Sold Out', 'Inactive'];

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Active':
        return <Badge variant="success">Active</Badge>;
      case 'Draft':
        return <Badge variant="neutral">Draft</Badge>;
      case 'Sold Out':
        return <Badge variant="danger">Sold Out</Badge>;
      case 'Inactive':
        return <Badge variant="warning">Inactive</Badge>;
      default:
        return <Badge>{st}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Products
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your crop listings, pricing, harvest inventory, and publication status.
          </p>
        </div>

        <Link to="/farmer/products/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card padding="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search crop or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
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

          {/* Sort */}
          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="price_desc">Sort: Price High → Low</option>
              <option value="price_asc">Sort: Price Low → High</option>
            </select>
          </div>
        </form>
      </Card>

      {/* Product List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 mt-3">Loading product inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#112D25] rounded-2xl border border-dashed border-slate-200 dark:border-[#21453A] p-8">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            You haven't listed any crops yet.
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            List your harvest with photos, pricing per quintal, and quantity to start receiving purchase offers from verified buyers.
          </p>
          <Link to="/farmer/products/new">
            <Button variant="primary" className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              <span>List Your First Crop</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <Card key={product.id} padding="p-0" className="overflow-hidden flex flex-col justify-between">
              {/* Image & Badges */}
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
                  {getStatusBadge(product.status)}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-xs text-white">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {product.crop_name}
                    </h3>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 shrink-0">
                      ₹{Number(product.price_per_quintal).toLocaleString('en-IN')}/qtl
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {product.description || 'No description provided.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-[#21453A] text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Available</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {product.quantity_available} {product.quantity_unit || 'quintal'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Harvest Date</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {product.harvest_date
                          ? new Date(product.harvest_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Recent'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#21453A] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Added {new Date(product.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Link to={`/farmer/products/${product.id}/edit`}>
                      <button
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </Link>

                    <button
                      onClick={() => {
                        setProductToDelete(product);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Archive product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={deleteLoading}
        title="Archive Product?"
        message={`Are you sure you want to archive "${productToDelete?.crop_name}"? It will no longer appear to buyers in the marketplace, but historical orders will be preserved.`}
        confirmText="Archive Product"
      />
    </div>
  );
};
