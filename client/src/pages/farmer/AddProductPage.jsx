import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Upload,
  X,
  Star,
  CheckCircle2,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { storageService } from '../../services/storageService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const COMMON_CROPS = [
  'Wheat', 'Rice', 'Maize', 'Cotton', 'Soybean',
  'Groundnut', 'Onion', 'Tomato', 'Potato',
  'Sugarcane', 'Bajra', 'Mustard', 'Chilli', 'Garlic',
];

const CATEGORIES = [
  'Grains', 'Vegetables', 'Fruits', 'Pulses',
  'Oilseeds', 'Spices', 'Cash Crops', 'Other',
];

const QUALITY_GRADES = ['A', 'B', 'C', 'Premium', 'Standard'];

export const AddProductPage = () => {
  const { user, profile, farmerProfile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [cropName, setCropName] = useState('');
  const [category, setCategory] = useState('Grains');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('quintal');
  const [pricePerQuintal, setPricePerQuintal] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [qualityGrade, setQualityGrade] = useState('A');
  const [city, setCity] = useState(farmerProfile?.farm_location?.split(',')?.[0]?.trim() || '');
  const [state, setState] = useState(farmerProfile?.farm_location?.split(',')?.[1]?.trim() || '');

  // Uploaded images state: array of { image_url, storage_path, is_primary }
  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUseFarmLocation = () => {
    if (farmerProfile?.farm_location) {
      const parts = farmerProfile.farm_location.split(',');
      setCity(parts[0]?.trim() || '');
      setState(parts[1]?.trim() || '');
      toast.info('Loaded your farm location');
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
          is_primary: newImages.length === 0, // first is primary
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
      // If the removed image was primary and others remain, make the first one primary
      if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  const handleSubmit = async (targetStatus = 'Active') => {
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
        city: city.trim(),
        state: state.trim(),
        status: targetStatus,
        images,
      };

      await productService.createProduct(payload);
      toast.success(
        targetStatus === 'Draft'
          ? 'Product saved as draft!'
          : 'Product published to marketplace successfully!'
      );
      navigate('/farmer/products');
    } catch (err) {
      toast.error(err.message || 'Failed to create product listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-4xl mx-auto">
      {/* Back button & Title */}
      <div className="flex items-center gap-4">
        <Link
          to="/farmer/products"
          className="p-2 rounded-xl bg-white dark:bg-[#112D25] border border-slate-200 dark:border-[#21453A] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            List New Crop
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Create an official harvest listing to reach buyers across the AgriNova marketplace.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section 1: Basic Crop Details */}
        <Card padding="p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Crop Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Crop Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sharbati Wheat, Red Onion, Basmati Rice"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] text-slate-400 py-0.5">Quick picks:</span>
                {COMMON_CROPS.slice(0, 8).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCropName(c)}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Product Description
                </label>
                <span className="text-[11px] text-slate-400">
                  {description.length} / 1000
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={1000}
                placeholder="Mention crop quality, moisture level, grain size, packaging options, organic certification or farming methods..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Pricing & Inventory */}
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
                  min="0.1"
                  step="any"
                  placeholder="e.g. 50"
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
                  placeholder="e.g. 2400"
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
                Available For Dispatch From
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

        {/* Section 3: Product Location */}
        <Card padding="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Location & Dispatch Origin
              </h2>
              <p className="text-xs text-slate-400">
                Where buyers or logistics partners can inspect and pick up this crop
              </p>
            </div>
            <button
              type="button"
              onClick={handleUseFarmLocation}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Use Farm Location
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                City / Mandi / District
              </label>
              <input
                type="text"
                placeholder="e.g. Nashik, Ahmedabad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                State
              </label>
              <input
                type="text"
                placeholder="e.g. Gujarat, Maharashtra"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </Card>

        {/* Section 4: Crop Images (Supabase Storage) */}
        <Card padding="p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Crop Photos ({images.length}/5)
              </h2>
              <p className="text-xs text-slate-400">
                Upload clear photos of the grain, field, or packaging. Select a primary image to display in search cards.
              </p>
            </div>
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

            {/* Upload Button */}
            {images.length < 5 && (
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-xl aspect-square flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {uploadingImage ? 'Uploading...' : 'Add Image'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG, WebP</span>
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

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => handleSubmit('Draft')}
          >
            Save as Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            isLoading={submitting}
            onClick={() => handleSubmit('Active')}
            className="w-full sm:w-auto"
          >
            Publish Product
          </Button>
        </div>
      </div>
    </div>
  );
};
