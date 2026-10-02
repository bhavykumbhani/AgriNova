import React, { useState } from 'react';
import { Plus, X, Check, Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const POPULAR_CROPS = [
  'Wheat',
  'Rice (Paddy)',
  'Maize',
  'Cotton',
  'Soybean',
  'Groundnut',
  'Onion',
  'Tomato',
  'Potato',
  'Sugarcane',
  'Bajra (Pearl Millet)',
  'Mustard',
  'Chilli',
  'Gram (Chana)',
];

export const CropMultiSelect = ({
  selectedCrops = [],
  onChange,
  error,
}) => {
  const { t } = useTranslation(['auth']);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customCrop, setCustomCrop] = useState('');

  const toggleCrop = (cropName) => {
    if (selectedCrops.includes(cropName)) {
      onChange(selectedCrops.filter((c) => c !== cropName));
    } else {
      onChange([...selectedCrops, cropName]);
    }
  };

  const handleAddCustomCrop = (e) => {
    e.preventDefault();
    const trimmed = customCrop.trim();
    if (trimmed && !selectedCrops.includes(trimmed)) {
      onChange([...selectedCrops, trimmed]);
      setCustomCrop('');
      setShowOtherInput(false);
    }
  };

  const removeCrop = (cropName) => {
    onChange(selectedCrops.filter((c) => c !== cropName));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-semibold text-agri-textDark flex items-center gap-1.5">
          <Sprout className="w-4 h-4 text-agri-primary" />
          <span>
            {t('farmerReg.primaryCrops', { defaultValue: 'Primary Crops' })} <span className="text-agri-danger">*</span>
          </span>
        </label>
        <span className="text-xs text-agri-textSecondary">
          {selectedCrops.length} selected
        </span>
      </div>

      {/* Selectable Chip Grid */}
      <div className="flex flex-wrap gap-2">
        {POPULAR_CROPS.map((crop) => {
          const isSelected = selectedCrops.includes(crop);
          return (
            <button
              key={crop}
              type="button"
              onClick={() => toggleCrop(crop)}
              className={`
                text-xs font-semibold px-3 py-2 rounded-xl border transition-all duration-200 flex items-center gap-1.5
                ${
                  isSelected
                    ? 'bg-agri-primary text-white border-agri-primary shadow-xs'
                    : 'bg-white text-agri-textDark border-agri-border hover:border-agri-primary/40 hover:bg-agri-softGreen/30'
                }
              `}
            >
              {isSelected ? (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span>{crop}</span>
            </button>
          );
        })}

        {/* Other Chip */}
        <button
          type="button"
          onClick={() => setShowOtherInput(!showOtherInput)}
          className={`
            text-xs font-semibold px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5
            ${
              showOtherInput
                ? 'bg-agri-dark text-white border-agri-dark'
                : 'bg-gray-50 text-agri-textDark border-dashed border-gray-300 hover:border-agri-primary hover:bg-white'
            }
          `}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Other Crop</span>
        </button>
      </div>

      {/* Other custom crop input */}
      {showOtherInput && (
        <form onSubmit={handleAddCustomCrop} className="flex gap-2 animate-fadeIn pt-1">
          <input
            type="text"
            autoFocus
            placeholder={t('farmerReg.otherCropPlaceholder', { defaultValue: 'Type custom crop name and press Enter' })}
            value={customCrop}
            onChange={(e) => setCustomCrop(e.target.value)}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-agri-primary/50 bg-white focus:outline-none focus:ring-2 focus:ring-agri-primary/20"
          />
          <button
            type="submit"
            disabled={!customCrop.trim()}
            className="px-4 py-2 bg-agri-primary text-white rounded-xl text-xs font-bold hover:bg-agri-dark disabled:opacity-50"
          >
            Add
          </button>
        </form>
      )}

      {/* Selected Custom / Additional Crops Badges */}
      {selectedCrops.some((c) => !POPULAR_CROPS.includes(c)) && (
        <div className="pt-2">
          <p className="text-[11px] font-semibold text-agri-textSecondary mb-1.5 uppercase tracking-wider">
            Custom Crops Added:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedCrops
              .filter((c) => !POPULAR_CROPS.includes(c))
              .map((custom) => (
                <span
                  key={custom}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-agri-dark px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  <span>{custom}</span>
                  <button
                    type="button"
                    onClick={() => removeCrop(custom)}
                    className="p-0.5 hover:text-red-600 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-agri-danger font-medium">{error}</p>}
    </div>
  );
};
