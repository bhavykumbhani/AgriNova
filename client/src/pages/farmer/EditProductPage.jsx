import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Upload,
  X,
  Star,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { storageService } from '../../services/storageService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
  'Grains', 'Vegetables', 'Fruits', 'Pulses',
  'Oilseeds', 'Spices', 'Cash Crops', 'Other',
];

const QUALITY_GRADES = ['A', 'B', 'C', 'Premium', 'Standard'];
const STATUSES = ['Active', 'Draft', 'Sold Out', 'Inactive'];

export const EditProductPage = () => {
  const { id } = useParams();
  const { user, profile, farmerProfile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cropName, setCropName] = useState('');
  const [category, setCategory] = useState('Grains');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('quintal');
  const [pricePerQuintal, setPricePerQuintal] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [qualityGrade, setQualityGrade] = useState('A');
  const [status, setStatus] = useState('Active');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await productService.getProductById(id);
      if (!product) {
        setNotFound(true);
        return;
      }

      setCropName(product.crop_name || '');
      setCategory(product.category || 'Grains');
      setDescription(product.description || '');
      setQuantity(product.quantity_available || '');
      setUnit(product.quantity_unit || 'quintal');
      setPricePerQuintal(product.price_per_quintal || '');
      setHarvestDate(product.harvest_date ? product.harvest_date.split('T')[0] : '');
      setAvailableFrom(product.available_from ? product.available_from.split('T')[0] : '');
      setQualityGrade(product.quality_grade || 'A');
      setStatus(product.status || 'Active');
      setCity(product.city || '');
      setState(product.state || '');

      // Load images
      if (Array.isArray(product.images) && product.images.length > 0) {
        setImages(
          product.images.map((img) => ({
            image_url: img.image_url,
            storage_path: img.storage_path,
            is_primary: Boolean(img.is_primary),
          }))
        );
      } else if (product.primary_image_url) {
        setImages([{ image_url: product.primary_image_url, is_primary: true }]);
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > 5) {
      toast.error('You can upload a maximum of 5 images per product.');
      return;
    }

    try {
      setUploadingImage(true);
      const newImages = [...images];

      for (const file of files) {
        const uploaded = await storageService.uploadProductImage(file, user.id);
        newImages.push({
          image_url: uploaded.image_url,
          storage_path: uploaded.storage_path,
          is_primary: newImages.length === 0,
        });
      }

      setImages(newImages);
      toast.success('Image(s) uploaded successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const setPrimaryImage = (index) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        is_primary: idx === index,
      }))
    );
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!cropName.trim()) {
      toast.error('Please enter a crop name');
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      toast.error('Please enter a valid available quantity');
      return;
    }
    if (!pricePerQuintal || Number(pricePerQuintal) <= 0) {
      toast.error('Please enter a valid price per quintal');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        crop_name: cropName.trim(),
        category,
        description: description.trim(),
        quantity_available: Number(quantity),
        quantity_unit: unit,
        price_per_quintal: Number(pricePerQuintal),
        harvest_date: harvestDate || null,
        available_from: availableFrom || null,
        quality_grade: qualityGrade,
        status,
        city: city.trim(),
        state: state.trim(),
        images,
      };

      await productService.updateProduct(id, payload);
      toast.success('Product updated successfully!');
      navigate('/farmer/products');
    } catch (err) {
      toast.error(err.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 mt-3">Loading product details...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-20 bg-white dark:bg-[#112D25] rounded-2xl border border-slate-200 dark:border-[#21453A] p-8 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Product not found</h2>
        <p className="text-xs text-slate-400 mt-1 mb-5">
          This crop listing does not exist or you do not have permission to manage it.
        </p>
        <Link to="/farmer/products">
          <Button variant="primary">Return to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          to="/farmer/products"
          className="p-2 rounded-xl bg-white dark:bg-[#112D25] border border-slate-200 dark:border-[#21453A] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Edit Crop Listing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Update crop price, available lot volume, images, or availability status.
          </p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <Card padding="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Listing Information
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Crop Name *
              </label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Quality Grade
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {QUALITY_GRADES.map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Product Description
              </label>
              <textarea
                rows={3}
                maxLength={1000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </Card>

        {/* Pricing & Quantity */}
        <Card padding="p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Quantity & Pricing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Available Quantity *
              </label>
              <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="px-3 bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border-l border-slate-200 dark:border-slate-800 focus:outline-none"
                >
                  <option value="quintal">quintal</option>
                  <option value="tonne">tonne</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Price Per Quintal (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  required
                  value={pricePerQuintal}
                  onChange={(e) => setPricePerQuintal(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Harvest Date
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Available From
              </label>
              <input
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </Card>

        {/* Images */}
        <Card padding="p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Photos ({images.length}/5)
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-square bg-slate-100 dark:bg-slate-900"
              >
                <img
                  src={img.image_url}
                  alt={`Product ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {img.is_primary && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                    Primary
                  </span>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                  {!img.is_primary && (
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(idx)}
                      className="px-2 py-1 rounded bg-white text-slate-900 text-[11px] font-bold hover:bg-emerald-50 transition-colors"
                    >
                      Set Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1 rounded bg-rose-600 text-white text-xs hover:bg-rose-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {images.length < 5 && (
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-xl aspect-square flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {uploadingImage ? 'Uploading...' : 'Add Image'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={uploadingImage}
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link to="/farmer/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" isLoading={submitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
